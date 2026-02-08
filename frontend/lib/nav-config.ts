import { type  NavItem } from "@/types/nav-type";
import {
  LayoutDashboard,
  Edit3,
  Inbox,
  BarChart2,
  BookOpen,
  HelpCircle,
  BarChart3,
  FilePlus,
  Users,
} from "lucide-react";

export const navDashboard: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

export const navUser: NavItem[] = [
  { title: "Otestovať sa", url: "/tests/test-yourself", icon: Edit3 },
  { title: "Pridelené testy", url: "/tests/assigned", icon: Inbox },
  { title: "Štatistiky", url: "/stats", icon: BarChart2 },
];

export const navTeacher: NavItem[] = [
  { title: "Spravovať predmety", url: "/subjects", icon: BookOpen },
  { title: "Spravovať otázky", url: "/questions", icon: HelpCircle },
  { title: "Vytvoriť test", url: "/tests/create", icon: FilePlus },
  { title: "Výsledky žiakov", url: "/results", icon: BarChart3 },
];

export const navAdmin: NavItem[] = [
  { title: "Správa používateľov", url: "/users", icon: Users },
];

export { NavItem };

