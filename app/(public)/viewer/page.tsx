import { ViewerVerificationForm } from "@/components/viewer/viewer-verification-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViewerPage() {
  return (
    <main className="container py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr,1.1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Viewer verification</CardTitle>
            <CardDescription>
              No password is required. Match the house number, CNIC, and mobile number to see
              receipts and pending dues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Residents can only see their own receipt and payment history.</p>
            <p>They cannot change any financial record.</p>
            <p>The demo values are pre-filled for quick testing.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verify your details</CardTitle>
            <CardDescription>After matching the record, only the linked house history is shown.</CardDescription>
          </CardHeader>
          <CardContent>
            <ViewerVerificationForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
