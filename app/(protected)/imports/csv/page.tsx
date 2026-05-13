import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CsvImportPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="CSV Import Preparation"
        description="This placeholder page defines the structure needed for future import of old Excel or manual fee records."
      />

      <Card>
        <CardHeader>
          <CardTitle>Expected columns</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          {[
            "Street number",
            "House number",
            "Month",
            "Year",
            "Amount due",
            "Amount received",
            "Balance",
            "Receipt number",
            "Payment date"
          ].map((field) => (
            <div key={field} className="rounded-2xl border p-4 font-medium">
              {field}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>OCR is intentionally not implemented here.</p>
          <p>The page is ready for future CSV upload and field mapping work.</p>
          <p>Use this as the staging area for old paper ledger conversion later.</p>
        </CardContent>
      </Card>
    </div>
  );
}
