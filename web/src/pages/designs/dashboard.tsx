import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ArrowUpRight,
  ChartColumn,
  ChevronsUpDown,
  LayoutDashboard,
  LifeBuoy,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "cn"
import { useFullscreen } from "@/hooks/use-fullscreen"

/**
 * Dashboard preview for the active design. Uses the shadcn sidebar with a
 * collapsible icon mode and trigger — it picks up the design's colors,
 * fonts, radius and shadows automatically.
 */
export function DashboardPreview() {
  const { ref, isFullscreen, toggle } = useFullscreen<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        "relative bg-background",
        isFullscreen
          ? "h-screen"
          : "h-[calc(100dvh-7.75rem)] min-h-[40rem] lg:h-[calc(100dvh-4.5rem)]"
      )}
    >
      <SidebarProvider className="h-full min-h-0">
        <Sidebar collapsible="icon" className="absolute inset-y-0 h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Acme Inc">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                    A
                  </span>
                  <span className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Enterprise plan
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto text-muted-foreground" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {/* Platform */}
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PLATFORM_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={item.label === "Dashboard"}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Support */}
            <SidebarGroup>
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SUPPORT_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton tooltip={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Aimyon">
                  <Avatar className="size-8">
                    <AvatarImage />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                  <span className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-medium">Aimyon</span>
                    <span className="truncate text-xs text-muted-foreground">
                      aimyon@acme.com
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto text-muted-foreground" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="overflow-hidden">
          <header className="flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-5" />
            <div className="min-w-0">
              <h1 className="font-heading text-lg leading-tight font-semibold">
                Dashboard
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Welcome back, here's what's happening today.
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
                onClick={toggle}
              >
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
              </Button>
              <Button variant="outline">Download Report</Button>
              <Button>
                New Transaction <ArrowUpRight />
              </Button>
            </div>
          </header>

          <main className="flex-1 space-y-6 overflow-y-auto p-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Revenue"
                value="$45,231.50"
                delta="+20.1% from last month"
              />
              <StatCard
                title="Subscriptions"
                value="+2,350"
                delta="+180.1% from last month"
              />
              <StatCard
                title="Sales"
                value="+12,234"
                delta="+19% from last month"
              />
              <StatCard
                title="Active Now"
                value="573"
                delta="+201 since last hour"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
              {/* Revenue chart */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>
                    Monthly revenue for the last year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={REVENUE_CONFIG}
                    className="h-64 w-full"
                  >
                    <AreaChart data={REVENUE}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Area
                        dataKey="value"
                        type="monotone"
                        fill="var(--color-revenue)"
                        fillOpacity={0.2}
                        stroke="var(--color-revenue)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Recent activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your team's latest transactions
                  </CardDescription>
                  <CardAction>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-5">
                  {ACTIVITIES.map((activity) => (
                    <div key={activity.name} className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback>{activity.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Transactions table */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Transactions</CardTitle>
                <CardDescription>
                  Manage your latest payments and refunds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Method
                      </TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TRANSACTIONS.map((tx) => (
                      <TableRow key={tx.customer}>
                        <TableCell>
                          <div className="font-medium">{tx.customer}</div>
                          <div className="text-sm text-muted-foreground">
                            {tx.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant={
                              tx.status === "Failed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {tx.method}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {tx.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

/* ----- data & helpers ----- */

const REVENUE = [
  { month: "Jan", value: 4100 },
  { month: "Feb", value: 3800 },
  { month: "Mar", value: 5200 },
  { month: "Apr", value: 4600 },
  { month: "May", value: 6100 },
  { month: "Jun", value: 5400 },
  { month: "Jul", value: 6800 },
  { month: "Aug", value: 7200 },
]

const REVENUE_CONFIG = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const PLATFORM_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Analytics", icon: ChartColumn },
]

const SUPPORT_ITEMS = [
  { label: "Settings", icon: Settings },
  { label: "Help Center", icon: LifeBuoy },
]

function StatCard({
  title,
  value,
  delta,
}: {
  title: string
  value: string
  delta: string
}) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{delta}</p>
      </CardContent>
    </Card>
  )
}

const ACTIVITIES = [
  {
    name: "Olivia Martin",
    initials: "OM",
    action: "requested a payout of $1,250.00",
    time: "2 minutes ago",
  },
  {
    name: "Jackson Lee",
    initials: "JL",
    action: "upgraded to the Enterprise plan",
    time: "1 hour ago",
  },
  {
    name: "Isabella Nguyen",
    initials: "IN",
    action: "added a new payment method",
    time: "3 hours ago",
  },
  {
    name: "William Kim",
    initials: "WK",
    action: "invited 4 members to the workspace",
    time: "Yesterday",
  },
]

const TRANSACTIONS = [
  {
    customer: "Sofia Davis",
    email: "sofia@mail.com",
    status: "Success",
    method: "Bank transfer",
    amount: "$2,500.00",
  },
  {
    customer: "Ethan Parker",
    email: "ethan@mail.com",
    status: "Pending",
    method: "Credit card",
    amount: "$150.00",
  },
  {
    customer: "Liam Rodriguez",
    email: "liam@mail.com",
    status: "Success",
    method: "PayPal",
    amount: "$990.00",
  },
  {
    customer: "Mia Chen",
    email: "mia@mail.com",
    status: "Failed",
    method: "Credit card",
    amount: "$75.50",
  },
  {
    customer: "Noah Patel",
    email: "noah@mail.com",
    status: "Success",
    method: "Bank transfer",
    amount: "$3,120.00",
  },
]
