import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="container flex min-h-screen items-center justify-center py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr,0.9fr]">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="px-0">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Staff access</p>
            <CardTitle className="text-4xl">Login for admin and street representatives</CardTitle>
            <CardDescription className="max-w-xl text-base leading-7">
              The staff portal is protected with role-based routing. Street representatives only see
              their own street data after login.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border bg-card p-5">
                <h3 className="text-lg font-bold">Demo admin</h3>
                <p className="mt-2 text-sm text-muted-foreground">Email: admin@worksociety.test</p>
                <p className="text-sm text-muted-foreground">Password: Admin123!</p>
              </div>
              <div className="rounded-3xl border bg-card p-5">
                <h3 className="text-lg font-bold">Demo street representative</h3>
                <p className="mt-2 text-sm text-muted-foreground">Email: street1@worksociety.test</p>
                <p className="text-sm text-muted-foreground">Password: Street123!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Use your staff email and password to enter the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm nextUrl={params.next} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
