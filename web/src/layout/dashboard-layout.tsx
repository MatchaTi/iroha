import { AppSidebar } from "@/components/shared/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full p-4">
        <div className="mb-4 lg:hidden">
          <SidebarTrigger />
        </div>
        <Outlet />
      </div>
    </SidebarProvider>
  )
}
