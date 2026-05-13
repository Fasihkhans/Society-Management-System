import { DeleteStreetButton } from "@/components/streets/delete-street-button";
import { StreetForm } from "@/components/streets/street-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth";
import { listStreets } from "@/lib/repositories";
import { formatCurrency } from "@/lib/utils";

export default async function StreetsPage() {
  const session = await requireAdmin();
  const streets = await listStreets(session);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Street Management"
        description="Add, edit, or remove streets. A street can only be deleted if it has no linked houses."
      />

      <section className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add street</CardTitle>
          </CardHeader>
          <CardContent>
            <StreetForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Street summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-wrap">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Street</TableHead>
                      <TableHead>Representative</TableHead>
                      <TableHead className="text-right">Houses</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead className="text-right">Recovery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {streets.map((street) => (
                      <TableRow key={street.id}>
                        <TableCell className="font-medium">
                          Street {street.number}
                          <div className="text-xs text-muted-foreground">{street.name}</div>
                        </TableCell>
                        <TableCell>{street.representativeName}</TableCell>
                        <TableCell className="text-right">{street.houseCount}</TableCell>
                        <TableCell className="text-right">{formatCurrency(street.pending)}</TableCell>
                        <TableCell className="text-right">{street.recovery}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Edit existing streets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {streets.map((street) => (
            <div key={street.id} className="rounded-3xl border p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">
                    Street {street.number} - {street.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{street.notes || "No notes added."}</p>
                </div>
                <DeleteStreetButton streetId={street.id} />
              </div>
              <StreetForm
                streetId={street.id}
                initialValues={{
                  number: street.number,
                  name: street.name,
                  notes: street.notes
                }}
                submitLabel="Update street"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
