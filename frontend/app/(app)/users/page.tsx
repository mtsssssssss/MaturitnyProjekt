"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserPassword, updateUserRole } from "@/api/users";
import { UserListItem } from "@/types/api/users";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Users, KeyRound } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageContent } from "@/lib/page-content";
import { PageHeading } from "@/components/ui/page-heading";

const roles = ["User", "Teacher", "Admin"] as const;
const ROLE_TO_NUM: Record<string, number> = { User: 1, Teacher: 2, Admin: 3 };

export default function UsersPage() {
  const { userRole, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading: isUsersLoading,
  } = useQuery<UserListItem[]>({
    queryKey: ["users"],
    queryFn: getUsers,
    enabled: !!isAuthenticated && userRole === "Admin",
  });

  const updateRoleMutation = useMutation({
    mutationFn: (payload: { id: string; role: (typeof roles)[number] }) =>
      updateUserRole(payload.id, { role: ROLE_TO_NUM[payload.role] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (payload: { id: string; newPassword: string }) =>
      updateUserPassword(payload.id, { newPassword: payload.newPassword }),
  });

  if (isAuthLoading || (isUsersLoading && userRole === "Admin")) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || userRole !== "Admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <Shield className="h-10 w-10 mx-auto text-primary" />
          <p className="text-lg font-semibold">
            Táto časť aplikácie je prístupná iba administrátorom.
          </p>
        </div>
      </div>
    );
  }

  const handleChangePassword = (user: UserListItem) => {
    const newPassword = window.prompt(
      `Zadaj nové heslo pre používateľa ${user.username}:`
    );

    if (!newPassword) return;

    updatePasswordMutation.mutate({ id: user.id, newPassword });
  };

  return (
    <PageContent>
      <PageHeading
        icon={Users}
        title="Správa používateľov"
        subtitle="Prehľad všetkých používateľov s možnosťou meniť role a heslá."
      />

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="px-4 py-3">Používateľ</TableHead>
              <TableHead className="hidden md:table-cell px-4 py-3">
                Meno a priezvisko
              </TableHead>
              <TableHead className="px-4 py-3">Rola</TableHead>
              <TableHead className="px-4 py-3 text-right">Akcie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-4 py-3 font-mono text-sm">
                  {user.username}
                </TableCell>
                <TableCell className="hidden md:table-cell px-4 py-3">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Select
                    value={user.role}
                    onValueChange={(value) =>
                      updateRoleMutation.mutate({
                        id: user.id,
                        role: value as (typeof roles)[number],
                      })
                    }
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleChangePassword(user)}
                    disabled={updatePasswordMutation.isPending}
                    className="gap-2"
                  >
                    <KeyRound className="h-4 w-4" />
                    Zmeniť heslo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContent>
  );
}

