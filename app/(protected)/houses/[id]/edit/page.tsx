import { HouseForm } from "@/components/houses/house-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { getHouseDetail, listStreets } from "@/lib/repositories";

type EditHousePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditHousePage({ params }: EditHousePageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const house = await getHouseDetail(id, session);
  const streets = await listStreets(session);

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Edit ${house.houseNumber}`}
        description="Update the house information and primary owner verification details."
      />
      <Card>
        <CardHeader>
          <CardTitle>House details</CardTitle>
        </CardHeader>
        <CardContent>
          <HouseForm
            houseId={house.id}
            streets={streets.map((street) => ({ id: street.id, number: street.number, name: street.name }))}
            initialValues={{
              streetId: house.street.id,
              houseNumber: house.houseNumber,
              ownerName: house.ownerName,
              cnic: house.cnic,
              mobile: house.mobile,
              ownerEmail: house.ownerEmail ?? "",
              status: house.status,
              monthlyFeeAmount: house.monthlyFeeAmount,
              openingBalance: house.openingBalance,
              notes: house.notes
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
