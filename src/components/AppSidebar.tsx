import { Home, Bell, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-8 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <span className="text-sidebar-primary-foreground font-bold text-sm">MV</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
              MedVoice
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                  >
                    <Home className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/notifications"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                  >
                    <Bell className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>Notifications</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/50 hover:text-destructive hover:bg-sidebar-accent transition-colors w-full"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Déconnexion</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
