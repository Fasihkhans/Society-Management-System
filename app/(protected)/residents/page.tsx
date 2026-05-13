import { ResidentForm } from "@/components/residents/resident-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireSession } from "@/lib/auth";
import { listHouses, listResidents } from "@/lib/repositories";

type ResidentsPageProps = {
  searchParams: Promise<{ search?: string; streetId?: string }>;
};

export default async function ResidentsPage({ searchParams }: ResidentsPageProps) {
  const session = await requireSession();
  const params = await searchParams;
  const residents = await listResidents(session, { search: params.search, streetId: params.streetId });
  const houses = await listHouses(session, {});

  return (
    <div className="space-y-4">
      <PageHeader
        title="Residents"
        description="Owner and tenant contact records are available here. House owner verification details are linked to the house record."
      />

      <section className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
        {session.role === "ADMIN" ? (
          <Card>
            <CardHeader>
              <CardTitle>Add resident</CardTitle>
            </CardHeader>
            <CardContent>
              <ResidentForm
                houses={houses.map((house) => ({
                  id: house.id,
                  houseNumber: house.houseNumber,
                  streetNumber: house.streetNumber
                }))}
              />
            </CardContent>
          </Card>
        ) : null}

        <Card className={session.role === "ADMIN" ? "" : "lg:col-span-2"}>
          <CardHeader>
            <CardTitle>Resident list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form>
              <Input name="search" placeholder="Search resident, CNIC, mobile, or house..." defaultValue={params.search} />
            </form>
            {residents.length === 0 ? (
              <EmptyState title="No residents found" description="Try a different search term." />
            ) : (
              <div className="table-wrap">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>House</TableHead>
                        <TableHead>Street</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>CNIC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {residents.map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium">{resident.fullName}</TableCell>
                          <TableCell>{resident.residentType}</TableCell>
                          <TableCell>{resident.house.houseNumber}</TableCell>
                          <TableCell>{resident.street.number}</TableCell>
                          <TableCell>{resident.mobile}</TableCell>
                          <TableCell>{resident.cnic}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
