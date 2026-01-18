import {
  Edit3,
  Inbox,
  BarChart2,
  BookOpen,
  HelpCircle,
  BarChart3,
  Users,
  FilePlus,
} from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const userItems = [
  {
    title: "Otestovať sa",
    url: "/tests/test-yourself",
    icon: Edit3,
  },
  {
    title: "Pridelené testy",
    url: "/tests/assigned",
    icon: Inbox,
  },
  {
    title: "Štatistiky",
    url: "/tests/statistics",
    icon: BarChart2,
  },
];

const teacherItems = [
  {
    title: "Spravovať predmety",
    url: "/subjects",
    icon: BookOpen,
  },
  {
    title: "Spravovať otázky",
    url: "/questions",
    icon: HelpCircle,
  },
  {
    title: "Vytvoriť test",
    url: "/tests/create",
    icon: FilePlus,
  },
  {
    title: "Výsledky žiakov",
    url: "/results",
    icon: BarChart3,
  },
];

const adminItems = [
  {
    title: "Správa používateľov",
    url: "/users",
    icon: Users,
  },
];

export default function SidebarContentMenu() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Moje testy a štatistiky</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {userItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Spravovanie testov</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {teacherItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Admin nástroje</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {adminItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
