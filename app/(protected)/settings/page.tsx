import { SettingsForm } from "@/components/shared/settings-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/repositories";

export default async function SettingsPage() {
  const session = await requireAdmin();
  const settings = await getSettings(session);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Settings"
        description="Keep the society name, receipt prefix, due date, and viewer notice simple and consistent."
      />
      <Card>
        <CardHeader>
          <CardTitle>General settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm initialValues={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
