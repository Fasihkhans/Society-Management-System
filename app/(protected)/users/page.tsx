import { UserForm } from "@/components/users/user-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth";
import { listStreets, listUsers } from "@/lib/repositories";

export default async function UsersPage() {
  const session = await requireAdmin();
  const users = await listUsers(session);
  const streets = await listStreets(session);

  return (
    <div className="space-y-4">
      <PageHeader
        title="User Management"
        description="Add admins or street representatives. Only one active representative can be assigned to a street."
      />
      <section className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add user</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm streets={streets.map((street) => ({ id: street.id, number: street.number, name: street.name }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-wrap">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned street</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role === "ADMIN" ? "Admin" : "Street Representative"}</TableCell>
                        <TableCell>{user.assignedStreetNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
