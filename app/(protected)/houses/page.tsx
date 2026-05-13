import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireSession } from "@/lib/auth";
import { listHouses, listStreets } from "@/lib/repositories";
import { formatCurrency } from "@/lib/utils";

type HousesPageProps = {
  searchParams: Promise<{ search?: string; streetId?: string; status?: string }>;
};

export default async function HousesPage({ searchParams }: HousesPageProps) {
  const session = await requireSession();
  const params = await searchParams;
  const houses = await listHouses(session, {
    search: params.search,
    streetId: params.streetId,
    status: params.status
  });
  const streets = session.role === "ADMIN" ? await listStreets(session) : [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Houses"
        description="Search by house number, owner name, mobile number, or filter by street and status."
        actions={
          session.role === "ADMIN" ? (
            <Button asChild>
              <Link href="/houses/new">Add house</Link>
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="p-6">
          <form className="grid gap-3 md:grid-cols-4">
            <Input name="search" placeholder="Search house, owner, mobile..." defaultValue={params.search} />
            {session.role === "ADMIN" ? (
              <Select name="streetId" defaultValue={params.streetId}>
                <option value="">All streets</option>
                {streets.map((street) => (
                  <option key={street.id} value={street.id}>
                    Street {street.number}
                  </option>
                ))}
              </Select>
            ) : (
              <Input value="Assigned street only" disabled />
            )}
            <Select name="status" defaultValue={params.status}>
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
            <Button type="submit">Apply filters</Button>
          </form>
        </CardContent>
      </Card>

      {houses.length === 0 ? (
        <EmptyState title="No houses found" description="Try a different search or clear your filters." />
      ) : (
        <div className="table-wrap">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>House</TableHead>
                  <TableHead>Street</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Monthly fee</TableHead>
                  <TableHead className="text-right">Current balance</TableHead>
                  {session.role === "ADMIN" ? <TableHead>Edit</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {houses.map((house) => (
                  <TableRow key={house.id}>
                    <TableCell className="font-medium">{house.houseNumber}</TableCell>
                    <TableCell>
                      Street {house.streetNumber}
                      <div className="text-xs text-muted-foreground">{house.streetName}</div>
                    </TableCell>
                    <TableCell>{house.ownerName}</TableCell>
                    <TableCell>{house.mobile}</TableCell>
                    <TableCell>
                      <Badge variant={house.status === "ACTIVE" ? "success" : "outline"}>
                        {house.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(house.monthlyFeeAmount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(house.currentBalance)}</TableCell>
                    {session.role === "ADMIN" ? (
                      <TableCell>
                        <Link href={`/houses/${house.id}/edit`} className="font-semibold text-primary">
                          Edit
                        </Link>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
