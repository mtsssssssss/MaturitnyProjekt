"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  navDashboard,
  navUser,
  navTeacher,
  navAdmin,
} from "@/lib/nav-config";

export default function SidebarContentMenu() {
  const { userRole, isAuthenticated } = useAuth();

  const isTeacherOrAdmin = userRole === "Teacher" || userRole === "Admin";
  const isAdmin = userRole === "Admin";

  return (
    <SidebarContent>
      {isAuthenticated && (
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navDashboard.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <a href={item.url}>
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Moje testy a štatistiky</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navUser.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <a href={item.url}>
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </>
      )}

      {isTeacherOrAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Spravovanie testov</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navTeacher.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <a href={item.url}>
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin nástroje</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navAdmin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <a href={item.url}>
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarContent>
  );
}
