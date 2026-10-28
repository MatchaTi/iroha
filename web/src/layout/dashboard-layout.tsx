import { AppSidebar } from "@/components/shared/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="w-full p-4">
          <div className="mb-4 hidden">
            <SidebarTrigger />
          </div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
