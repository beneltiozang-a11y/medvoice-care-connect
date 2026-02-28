import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/PatientSidebar";

export function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PatientSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 border-b border-border bg-background flex items-center px-4 shrink-0">
            <SidebarTrigger className="text-muted-foreground" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
