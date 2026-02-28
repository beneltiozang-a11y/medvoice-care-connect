import { Calendar, Phone, FileText, LogOut, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function PatientSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "PT";

  return (
    <Sidebar collapsible="none">
      <SidebarContent className="pt-5">
        <div className="px-4 mb-6 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">MedVoice</span>
          )}
        </div>

        <SidebarMenu className="px-2 space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-primary font-medium text-sm w-full">
                <Calendar className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Mon espace</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="pb-4">
        {!collapsed && (
          <div className="px-4 py-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-sidebar-foreground">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-sidebar-foreground/40">Patient</p>
              </div>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/40 hover:text-destructive hover:bg-sidebar-accent transition-colors w-full text-sm"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Déconnexion</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
