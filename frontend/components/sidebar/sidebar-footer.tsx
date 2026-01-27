"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { ChevronUp, LogOut, User2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFullUserInfo } from "@/api/auth";

export default function SidebarFooterManageUser() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const { data: fullUser } = useQuery({
    queryKey: ["full-user-info"],
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
          <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
              {/* Vylepšený button s jemným hoverom a lepším paddingom */}
              <SidebarMenuButton 
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <User2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-semibold text-foreground">
                    {fullUser ? `${fullUser.firstName} ${fullUser.lastName}` : user?.username}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {fullUser?.username ?? user?.username}
                  </span>
                </div>
                <ChevronUp className="ml-auto size-4 opacity-50 transition-transform duration-200" />
              </SidebarMenuButton>
            </DropdownMenuPrimitive.Trigger>

            {/* UPRAVENÝ CONTENT: Pridaný shadow, border a animácie */}
            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                side="top"
                align="end"
                sideOffset={8}
                className="z-50 min-w-[200px] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                style={{ width: 'var(--radix-popper-anchor-width)' }}
                >
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Účet
                </div>
                
                <DropdownMenuPrimitive.Separator className="h-px bg-border my-1" />
                
                <DropdownMenuPrimitive.Group>
                    <DropdownMenuPrimitive.Item 
                        onClick={handleLogout}
                        className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-red-600 outline-none transition-colors hover:bg-red-50 focus:bg-red-50 focus:text-red-700 group"
                    >
                        <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        <span className="font-medium">Odhlásiť sa</span>
                        <DropdownMenuPrimitive.ItemIndicator />
                    </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Group>
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}