import {
  ArrowRight,
  BarChart3,
  Calendar,
  ChartPie,
  ChevronUp,
  CircleDollarSign,
  FileText,
  Globe,
  Landmark,
  Plus,
  QrCode,
  Search,
  Shield,
  Target,
  TrendingUp,
  Wallet,
  X,
  ArrowUpRight,
} from "lucide-react"
import { useState } from "react"
import { Bar, BarChart, XAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty"
import { cn } from "cn"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Item, ItemContent, ItemDescription, ItemTitle } from "../ui/item"
import { Field, FieldLabel } from "../ui/field"

/**
 * A dense dashboard of shadcn components used as the live preview for the
 * shape editor. Every card, button and input uses the default `rounded-*`
 * and `shadow-*` utilities, so it follows the design's radius and shadow.
 */
export function ShapePreview() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-5">
        <ControlsCard />
        <MenuCard
          title="Planning"
          items={[
            { icon: FileText, label: "Documents" },
            { icon: Wallet, label: "Budget" },
            { icon: BarChart3, label: "Reports" },
            { icon: Target, label: "Goals" },
            { icon: Calendar, label: "Calendar" },
          ]}
        />
        <MenuCard
          title="Overview"
          items={[
            { icon: ChartPie, label: "Analytics", active: true },
            { icon: ArrowUpRight, label: "Transactions" },
            { icon: TrendingUp, label: "Investments" },
            { icon: Landmark, label: "Accounts" },
            { icon: CircleDollarSign, label: "Spending" },
          ]}
        />
        <NotificationsCard />
      </div>

      <div className="space-y-5">
        <ContributionCard />
        <BalanceCard />
        <Card>
          <Empty>
            <EmptyMedia variant={"icon"}>
              <Plus />
            </EmptyMedia>
            <EmptyContent>
              <EmptyHeader>
                <EmptyTitle>Distribute Track</EmptyTitle>
                <EmptyDescription>
                  Upload your first master to start reaching listeners on
                  Spotify, Apple Music, and more.
                </EmptyDescription>
              </EmptyHeader>

              <Button>Create Release</Button>
            </EmptyContent>
          </Empty>
        </Card>
      </div>

      <div className="space-y-5">
        <MilestoneCard />
        <PayoutCard />
        <QrCard />
      </div>
    </div>
  )
}

/* ----- data & chart config ----- */

const CONTRIBUTIONS = [
  { month: "Dec", value: 320 },
  { month: "Jan", value: 250 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 290 },
  { month: "Apr", value: 160 },
]

const CONTRIBUTION_CONFIG = {
  value: { label: "Contributions", color: "var(--accent)" },
} satisfies ChartConfig

function MenuCard({
  title,
  items,
}: {
  title: string
  items: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    label: string
    active?: boolean
  }[]
}) {
  return (
    <Card>
      <CardContent>
        <p className="mb-2 text-xs text-muted-foreground">{title}</p>
        <nav className="space-y-1">
          {items.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-accent",
                item.active ? "bg-accent font-medium" : ""
              )}
            >
              <item.icon className="size-4 text-muted-foreground" />
              {item.label}
            </div>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

function ControlsCard() {
  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">
            Button <ArrowRight />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>

        <InputGroup>
          <InputGroupAddon align={"inline-end"}>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Name" />
        </InputGroup>

        <Textarea placeholder="Message" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroup defaultValue="one" className="flex items-center gap-2">
              <RadioGroupItem value="one" />
              <RadioGroupItem value="two" />
            </RadioGroup>
            <Checkbox defaultChecked />
            <Switch defaultChecked />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="outline" size="sm">
            Alert Dialog
          </Button>
          <ButtonGroup>
            <Button variant="outline">Button Group</Button>
            <Button variant="outline" className="px-2">
              <ChevronUp />
            </Button>
          </ButtonGroup>
        </div>
      </CardContent>
    </Card>
  )
}

function ContributionCard() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <CardTitle>Contribution History</CardTitle>
          <CardDescription>Last 6 months of activity</CardDescription>
        </div>
        <ChartContainer config={CONTRIBUTION_CONFIG} className="h-40 w-full">
          <BarChart data={CONTRIBUTIONS}>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={8}
              barSize={28}
            />
          </BarChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-4">
          <Item variant={"muted"}>
            <ItemContent>
              <ItemDescription>Upcoming</ItemDescription>
              <ItemTitle>May 2024</ItemTitle>
              <ItemDescription>Scheduled</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant={"muted"}>
            <ItemContent>
              <ItemDescription>Savings Plan</ItemDescription>
              <ItemTitle>Accelerated</ItemTitle>
              <ItemDescription>Recurring</ItemDescription>
            </ItemContent>
          </Item>
        </div>
        <Button className="w-full">View Full Report</Button>
      </CardContent>
    </Card>
  )
}

function BalanceCard() {
  const rows = [
    { label: "Net Royalties", value: "$1,248.75" },
    { label: "Processing Fee", value: "-$37.46" },
  ]
  return (
    <Card>
      <CardHeader>
        <CardDescription>Balance Overview</CardDescription>
        <CardTitle className="text-4xl">$1,211.29</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge variant="secondary">
            <span className="size-1.5 rounded-full bg-amber-400" />
            Pending Setup
          </Badge>
        </div>
        <div className="space-y-4 rounded-lg bg-muted p-4">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-sm font-medium">
            <span>Total Ready to Claim</span>
            <span>$1,211.29 USD</span>
          </div>
        </div>
        <CardDescription>
          Once your bank is connected, balances over $10.00 are automatically
          eligible for monthly distribution on the 15th of each month.
        </CardDescription>
      </CardContent>
    </Card>
  )
}

function MilestoneCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set a new milestone</CardTitle>
        <CardDescription>
          Define your financial target and we'll help you pace your savings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Goal Name</FieldLabel>
          <Input placeholder="e.g. New Car, Home Downpayment" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Target Amount</FieldLabel>
            <Input placeholder="$15,000" />
          </Field>
          <Field>
            <FieldLabel>Target Date</FieldLabel>
            <Input placeholder="Dec 2025" />
          </Field>
        </div>
        <Button className="w-full">Create Goal</Button>
        <Button variant="outline" className="w-full">
          Cancel
        </Button>
      </CardContent>
    </Card>
  )
}

function PayoutCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Payout Threshold</CardTitle>
          <Button variant="ghost" size="icon">
            <X />
          </Button>
        </div>
        <CardDescription>
          Set the minimum balance required before a payout is triggered.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Preferred Currency</FieldLabel>
          <NativeSelect defaultValue="usd">
            <option value="usd">USD — United States Dollar</option>
            <option value="eur">EUR — Euro</option>
            <option value="idr">IDR — Indonesian Rupiah</option>
          </NativeSelect>
        </Field>
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium">Minimum Payout Amount</p>
          <p className="text-xl font-semibold">$2500.00</p>
        </div>
        <Progress value={12} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$50 (MIN)</span>
          <span>$10,000 (MAX)</span>
        </div>
        <Field>
          <FieldLabel>Notes</FieldLabel>
          <Textarea placeholder="Add any notes for this payout configuration..." />
        </Field>
        <Button className="w-full">Save Threshold</Button>
      </CardContent>
    </Card>
  )
}

function QrCard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="rounded-lg bg-foreground p-3">
          <QrCode className="size-24 text-background" strokeWidth={1.5} />
        </div>
        <CardTitle>Scan to connect your mobile device</CardTitle>
        <CardDescription>
          Open the Ledger mobile app and scan this code to link your device.
        </CardDescription>
      </CardContent>
    </Card>
  )
}

function NotificationsCard() {
  const [prefs, setPrefs] = useState({
    transaction: true,
    security: true,
    milestones: false,
    market: false,
  })
  const options = [
    {
      key: "transaction",
      icon: CircleDollarSign,
      title: "Transaction alerts",
      description: "Deposits, withdrawals, and transfers.",
    },
    {
      key: "security",
      icon: Shield,
      title: "Security alerts",
      description: "Login attempts and account changes.",
    },
    {
      key: "milestones",
      icon: Target,
      title: "Goal milestones",
      description: "Updates at 25%, 50%, 75%, and 100%.",
    },
    {
      key: "market",
      icon: Globe,
      title: "Market updates",
      description: "Daily portfolio summary and price alerts.",
    },
  ] as const

  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose which email and push alerts you want to receive.
        </CardDescription>
        <div className="space-y-4">
          {options.map((option) => (
            <label
              key={option.key}
              className="flex cursor-pointer items-start gap-3"
            >
              <Checkbox
                className="mt-0.5"
                checked={prefs[option.key]}
                onCheckedChange={(checked) =>
                  setPrefs((prev) => ({ ...prev, [option.key]: !!checked }))
                }
              />
              <span className="space-y-0.5">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <option.icon className="size-3.5 text-muted-foreground" />
                  {option.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
        <Button className="w-full">Save Preferences</Button>
      </CardContent>
    </Card>
  )
}
