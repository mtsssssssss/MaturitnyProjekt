import SidebarFooterManageUser from "./sidebar-footer";
import { Sidebar } from "@/components/ui/sidebar";
import SidebarContentMenu from "./sidebar-content";


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContentMenu />
      <SidebarFooterManageUser />
    </Sidebar>
  );
}
