"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronUp, LogOut, User2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFullUserInfo } from "@/api/auth";

export default function SidebarFooterManageUser() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const { data: fullUser } = useQuery({
    queryKey: ["full-user-info", "me"],
    queryFn: getFullUserInfo,
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <User2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-semibold text-foreground">
                    {fullUser
                      ? `${fullUser.firstName} ${fullUser.lastName}`
                      : user?.username}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {fullUser?.username ?? user?.username}
                  </span>
                </div>
                <ChevronUp className="ml-auto size-4 opacity-50 transition-transform duration-200" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              sideOffset={8}
              className="min-w-[200px] rounded-xl"
              style={{ width: "var(--radix-popper-anchor-width)" }}
            >
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Účet
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Odhlásiť sa
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
