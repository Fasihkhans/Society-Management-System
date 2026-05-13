import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin, requireSession } from "@/lib/auth";
import { HouseForm } from "@/components/houses/house-form";
import { listStreets } from "@/lib/repositories";

export default async function NewHousePage() {
  const session = await requireAdmin();
  const streets = await listStreets(session);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Add House"
        description="Create a house record with street, owner details, monthly fee amount, and opening balance."
      />
      <Card>
        <CardHeader>
          <CardTitle>House details</CardTitle>
        </CardHeader>
        <CardContent>
          <HouseForm streets={streets.map((street) => ({ id: street.id, number: street.number, name: street.name }))} />
        </CardContent>
      </Card>
    </div>
  );
}
