import { LayoutDashboard, Users, Calendar, MessageSquare, FileText, BarChart3, Sparkles, Mic, BookOpen, Settings, LogOut } from "lucide-react";
import { ClerkLogo } from "@/components/ClerkLogo";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, active: true },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Schedule", icon: Calendar },
  { title: "Messages", icon: MessageSquare, badge: "3" },
  { title: "Prescriptions", icon: FileText },
  { title: "Analytics", icon: BarChart3 },
];

const toolsNav = [
  { title: "AI Intelligence", icon: Sparkles },
  { title: "Speechmatics", icon: Mic },
];

const supportNav = [
  { title: "Documentation", icon: BookOpen },
  { title: "Settings", icon: Settings },
];

const sectionLabel = "text-[11px] uppercase tracking-[0.08em] text-[#9BA8B5] font-medium px-3 mb-1.5";

function ComingSoonButton({ item }: { item: { title: string; icon: React.ElementType; badge?: string } }) {
  return (
    <button
      onClick={() => toast.info(`${item.title} — coming soon`)}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-[#6B7A8D] hover:bg-[#F0F5FF] hover:text-primary transition-colors text-sm w-full group"
    >
      <item.icon className="h-[18px] w-[18px] shrink-0 text-[#6B7A8D] group-hover:text-primary transition-colors" />
      <span className="flex-1 text-left">{item.title}</span>
      {item.badge && (
        <span className="h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </button>
  );
}

export function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="none" className="border-r border-border">
      <SidebarContent className="pt-5 flex flex-col">
        {/* Logo */}
        <div className="px-4 mb-6">
          <ClerkLogo />
        </div>

        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) =>
                item.url ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-[#6B7A8D] hover:bg-[#F0F5FF] hover:text-primary transition-colors text-sm"
                        activeClassName="bg-secondary text-primary font-medium border-l-2 border-l-primary"
                      >
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <ComingSoonButton item={item} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider + Tools */}
        <div className="px-3 mt-6">
          <div className="h-px bg-border" />
        </div>
        <SidebarGroup className="mt-4">
          <p className={sectionLabel}>Tools</p>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <ComingSoonButton item={item} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider + Support */}
        <div className="px-3 mt-6">
          <div className="h-px bg-border" />
        </div>
        <SidebarGroup className="mt-4">
          <p className={sectionLabel}>Support</p>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <ComingSoonButton item={item} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex-1" />
      </SidebarContent>

      <SidebarFooter className="pb-4">
        <div className="px-4 py-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-primary">LM</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Dr. Laurent Martin</p>
              <p className="text-[10px] text-muted-foreground">General Practitioner</p>
            </div>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors w-full text-sm"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sign out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
