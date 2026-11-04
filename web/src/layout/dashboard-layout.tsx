import { AppSidebar } from "@/components/shared/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </SidebarProvider>
  )
}
