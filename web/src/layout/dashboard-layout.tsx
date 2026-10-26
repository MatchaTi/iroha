import { AppSidebar } from "@/components/shared/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="p-4">
        <SidebarTrigger />
        <Outlet />
      </div>
    </SidebarProvider>
  )
}
