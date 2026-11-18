import * as React from "react"
import { Area, AreaChart } from "recharts"
import {
  Bell,
  Calendar as CalendarIcon,
  ChartColumn,
  Check,
  Circle,
  CreditCard,
  Globe,
  Settings,
  Sparkles,
  Terminal,
} from "lucide-react"
import { useParams } from "react-router"
import { useDesignStore } from "@/store/use-design"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Cursor,
  CursorBody,
  CursorName,
  CursorPointer,
} from "@/components/ui/cursor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Marker } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { NativeSelect } from "@/components/ui/native-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
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
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

/**
 * Design details: a plain gallery of every shadcn component in the UI
 * folder — rendered without cards so the design's tokens (colors, fonts,
 * radius, shadows) are evaluated directly on each component.
 */

export function DesignDetails() {
  const { id } = useParams<{ id: string }>()
  const design = useDesignStore((state) =>
    state.designs.find((d) => d.id === id)
  )

  return (
    <main className="space-y-12 p-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold">
          {design?.name ?? "Design"}
        </h1>
        {design?.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {design.description}
          </p>
        )}
      </header>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-5">
          <Demo name="Button">
            <div className="flex flex-col items-start gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Bell />
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Demo>

          <Demo name="Button group">
            <ButtonGroup>
              <Button variant="outline">One</Button>
              <Button variant="outline">Two</Button>
              <Button variant="outline">Three</Button>
            </ButtonGroup>
          </Demo>

          <Demo name="Toggle">
            <div className="flex items-center gap-3">
              <Toggle aria-label="Toggle bold">Bold</Toggle>
              <Toggle variant="outline" aria-label="Toggle outline">
                Outline
              </Toggle>
            </div>
          </Demo>

          <Demo name="Toggle group">
            <ToggleGroup variant="outline">
              <ToggleGroupItem value="a" aria-label="Toggle a">
                <Check />A
              </ToggleGroupItem>
              <ToggleGroupItem value="b" aria-label="Toggle b">
                <Circle />B
              </ToggleGroupItem>
            </ToggleGroup>
          </Demo>

          <Demo name="Animated theme toggler">
            <AnimatedThemeToggler />
          </Demo>

          <Demo name="Badge">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </Demo>

          <Demo name="Marker">
            <Marker>
              <Sparkles /> Marker
            </Marker>
          </Demo>

          <Demo name="Kbd">
            <Kbd>⌘K</Kbd>
          </Demo>

          <Demo name="Spinner">
            <Spinner />
          </Demo>

          <Demo name="Skeleton">
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </Demo>

          <Demo name="Progress">
            <Progress value={60} className="max-w-md">
              <ProgressLabel>Storage</ProgressLabel>
              <ProgressValue />
            </Progress>
          </Demo>

          <Demo name="Avatar">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Demo>

          <Demo name="Alert">
            <Alert className="max-w-md">
              <Bell />
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>
                Every component on this page is themed by the design tokens.
              </AlertDescription>
            </Alert>
          </Demo>

          <Demo name="Toast">
            <Button
              variant="outline"
              onClick={() =>
                toast.add({
                  title: "Toast",
                  description: "Triggered from the details gallery.",
                  type: "success",
                })
              }
            >
              Show toast
            </Button>
          </Demo>

          <Demo name="Input">
            <Input placeholder="Type something..." className="max-w-md" />
          </Demo>

          <Demo name="Label">
            <Label htmlFor="demo-label-input">Email address</Label>
          </Demo>

          <Demo name="Checkbox">
            <Checkbox />
          </Demo>

          <Demo name="Switch">
            <Switch defaultChecked />
          </Demo>

          <Demo name="Radio group">
            <DemoRadio />
          </Demo>

          <Demo name="Accordion">
            <Accordion className="max-w-md">
              <AccordionItem value="one">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It follows WAI-ARIA patterns.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="two">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes, entirely with design tokens.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Demo>

          <Demo name="Command">
            <DemoCommand />
          </Demo>

          <Demo name="Carousel">
            <DemoCarousel />
          </Demo>
        </div>

        <div className="space-y-5">
          <Demo name="Textarea">
            <Textarea placeholder="Longer text..." className="max-w-md" />
          </Demo>

          <Demo name="Native select">
            <NativeSelect defaultValue="b" className="max-w-md">
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
            </NativeSelect>
          </Demo>

          <Demo name="Select">
            <DemoSelect />
          </Demo>

          <Demo name="Slider">
            <Slider
              defaultValue={[40]}
              max={100}
              step={1}
              className="max-w-md"
            />
          </Demo>

          <Demo name="Input OTP">
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </Demo>

          <Demo name="Input group">
            <InputGroup className="max-w-md">
              <input placeholder="Search docs..." className="w-full" />
              <InputGroupAddon
                align="inline-end"
                className="text-muted-foreground"
              >
                <Kbd>⌘K</Kbd>
              </InputGroupAddon>
            </InputGroup>
          </Demo>

          <Demo name="Field">
            <Field className="max-w-md">
              <FieldLabel htmlFor="demo-field">Workspace URL</FieldLabel>
              <input
                id="demo-field"
                placeholder="acme.com"
                className="w-full rounded-xl bg-input/50 px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              />
              <FieldError>Only lowercase letters and dashes.</FieldError>
            </Field>
          </Demo>

          <Demo name="Calendar">
            <Calendar className="w-fit rounded-xl border" />
          </Demo>

          <Demo name="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<a href="#home" />}>
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink render={<a href="#components" />}>
                    Components
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Demo>

          <Demo name="Tabs">
            <DemoTabs />
          </Demo>

          <Demo name="Pagination">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#prev" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive href="#1">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#2">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#next" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Demo>

          <Demo name="Menubar">
            <DemoMenubar />
          </Demo>

          <Demo name="Navigation menu">
            <DemoNavigationMenu />
          </Demo>

          <Demo name="Collapsible">
            <Collapsible className="max-w-md">
              <CollapsibleTrigger
                render={<Button variant="outline">Toggle</Button>}
              />
              <CollapsibleContent className="text-sm text-muted-foreground">
                This content collapses and expands.
              </CollapsibleContent>
            </Collapsible>
          </Demo>

          <Demo name="Popover">
            <DemoPopover />
          </Demo>

          <Demo name="Tooltip">
            <DemoTooltip />
          </Demo>

          <Demo name="Hover card">
            <DemoHoverCard />
          </Demo>

          <Demo name="Dialog">
            <DemoDialog />
          </Demo>

          <Demo name="Alert dialog">
            <DemoAlertDialog />
          </Demo>

          <Demo name="Dropdown menu">
            <DemoDropdown />
          </Demo>

          <Demo name="Chart">
            <DemoChart />
          </Demo>

          <Demo name="Trace">
            <DemoTrace />
          </Demo>
        </div>

        <div className="space-y-5">
          <Demo name="Context menu">
            <DemoContextMenu />
          </Demo>

          <Demo name="Sheet">
            <DemoSheet />
          </Demo>

          <Demo name="Drawer">
            <DemoDrawer />
          </Demo>

          <Demo name="Combobox">
            <DemoCombobox />
          </Demo>

          <Demo name="Separator">
            <Separator className="max-w-md" />
          </Demo>

          <Demo name="Scroll area">
            <ScrollArea className="h-24 max-w-md rounded-xl border p-3 text-sm">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="py-1 text-muted-foreground">
                  Scrollable line {i + 1}
                </div>
              ))}
            </ScrollArea>
          </Demo>

          <Demo name="Resizable">
            <ResizablePanelGroup className="h-40 max-w-md rounded-xl border">
              <ResizablePanel
                defaultSize={50}
                className="grid place-items-center text-sm text-muted-foreground"
              >
                Left
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                defaultSize={50}
                className="grid place-items-center text-sm text-muted-foreground"
              >
                Right
              </ResizablePanel>
            </ResizablePanelGroup>
          </Demo>

          <Demo name="Aspect ratio">
            <AspectRatio
              ratio={16 / 9}
              className="max-w-md overflow-hidden rounded-xl border bg-muted"
            >
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Aspect ratio 16:9
              </div>
            </AspectRatio>
          </Demo>

          <Demo name="Item">
            <ItemGroup className="max-w-md">
              <Item>
                <ItemMedia variant="icon">
                  <Bell />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Notifications</ItemTitle>
                  <ItemDescription>
                    Replies to your comments and mentions.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch defaultChecked />
                </ItemActions>
              </Item>
              <Item>
                <ItemMedia variant="icon">
                  <CreditCard />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Billing</ItemTitle>
                  <ItemDescription>
                    Invoices and payment methods.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </ItemActions>
              </Item>
            </ItemGroup>
          </Demo>

          <Demo name="Sidebar">
            <DemoSidebar />
          </Demo>

          <Demo name="Table">
            <Table className="max-w-md">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Ada</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Grace</TableCell>
                  <TableCell>
                    <Badge variant="outline">Idle</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Demo>

          <Demo name="Empty">
            <Empty className="max-w-md border-b-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bell />
                </EmptyMedia>
                <EmptyTitle>No notifications</EmptyTitle>
                <EmptyDescription>You're all caught up.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Demo>

          <Demo name="Message & bubble">
            <DemoChat />
          </Demo>

          <Demo name="Cursor">
            <div className="relative h-24 max-w-md overflow-hidden rounded-xl border bg-muted/40">
              <Cursor color="var(--chart-2)" className="absolute top-6 left-10">
                <CursorPointer />
                <CursorBody className="rounded-md px-2 py-0.5 text-xs">
                  <CursorName>Sara</CursorName>
                </CursorBody>
              </Cursor>
              <span className="absolute bottom-3 left-4 text-xs text-muted-foreground">
                Collaborative cursor
              </span>
            </div>
          </Demo>

          <Demo name="Questionnaire">
            <DemoQuestionnaire />
          </Demo>
        </div>
      </div>{" "}
    </main>
  )
}

function Demo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{name}</h3>
      {children}
    </div>
  )
}

/* ----- small demos that need state ----- */

function DemoSelect() {
  const [value, setValue] = React.useState("b")
  return (
    <Select value={value} onValueChange={(next) => next && setValue(next)}>
      <SelectTrigger className="w-full max-w-md">
        <SelectValue>
          {value === "a" ? "Option A" : value === "b" ? "Option B" : "Option C"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
        <SelectItem value="c">Option C</SelectItem>
      </SelectContent>
    </Select>
  )
}

function DemoRadio() {
  const [value, setValue] = React.useState("a")
  return (
    <RadioGroup value={value} onValueChange={(next) => next && setValue(next)}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="demo-radio-a" />
        <Label htmlFor="demo-radio-a">First</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="demo-radio-b" />
        <Label htmlFor="demo-radio-b">Second</Label>
      </div>
    </RadioGroup>
  )
}

function DemoTabs() {
  return (
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one" className="text-sm text-muted-foreground">
        First tab content.
      </TabsContent>
      <TabsContent value="two" className="text-sm text-muted-foreground">
        Second tab content.
      </TabsContent>
      <TabsContent value="three" className="text-sm text-muted-foreground">
        Third tab content.
      </TabsContent>
    </Tabs>
  )
}

function DemoMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New tab</MenubarItem>
          <MenubarItem>New window</MenubarItem>
          <MenubarItem disabled>Disabled item</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

function DemoNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuPositioner>
            <NavigationMenuContent className="w-64 p-4">
              <div className="flex flex-col gap-2 text-sm">
                <a href="#docs" className="hover:underline">
                  Documentation
                </a>
                <a href="#guide" className="hover:underline">
                  Guides
                </a>
                <a href="#api" className="hover:underline">
                  API reference
                </a>
              </div>
            </NavigationMenuContent>
          </NavigationMenuPositioner>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink render={<a href="#docs" />}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function DemoPopover() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Popover</Button>} />
      <PopoverContent className="w-64">
        <p className="text-sm font-medium">Popover</p>
        <p className="text-sm text-muted-foreground">
          Anchored to the trigger button.
        </p>
      </PopoverContent>
    </Popover>
  )
}

function DemoTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Tooltip</Button>} />
      <TooltipContent>
        <p>Helpful hint</p>
      </TooltipContent>
    </Tooltip>
  )
}

function DemoHoverCard() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<Button variant="outline">Hover card</Button>}
      />
      <HoverCardContent className="w-64">
        <div className="space-y-1">
          <p className="text-sm font-medium">@base-ui/react</p>
          <p className="text-sm text-muted-foreground">
            Unstyled UI primitives this project is built on.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function DemoDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog</DialogTitle>
          <DialogDescription>
            A centered modal with a close button.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Body content goes here.</p>
      </DialogContent>
    </Dialog>
  )
}

function DemoAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline">Alert dialog</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DemoDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline">Dropdown</Button>}
      />
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Globe /> Community
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CreditCard /> Billing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DemoContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function DemoSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Sheet</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet</SheetTitle>
          <SheetDescription>Slides in from the side.</SheetDescription>
        </SheetHeader>
        <p className="p-4 text-sm text-muted-foreground">Sheet body.</p>
      </SheetContent>
    </Sheet>
  )
}

function DemoDrawer() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Drawer</Button>} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>Rises from the bottom.</DrawerDescription>
        </DrawerHeader>
        <p className="p-4 pb-8 text-sm text-muted-foreground">Drawer body.</p>
      </DrawerContent>
    </Drawer>
  )
}

function DemoCombobox() {
  return (
    <Combobox>
      <ComboboxInput placeholder="Framework..." aria-label="Framework" />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxItem value="react">React</ComboboxItem>
          <ComboboxItem value="solid">Solid</ComboboxItem>
          <ComboboxItem value="vue">Vue</ComboboxItem>
          <ComboboxItem value="svelte">Svelte</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function DemoCommand() {
  return (
    <Command className="max-w-sm rounded-xl border">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <Terminal /> Run build
          </CommandItem>
          <CommandItem>
            <CalendarIcon /> Open calendar
          </CommandItem>
          <CommandItem>
            <ChartColumn /> View analytics
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function DemoTrace() {
  return (
    <Trace className="max-w-md">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceIcon>
              <Terminal className="animate-spin" />
            </TraceIcon>
            <TraceTitle>Running tests</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="font-mono text-xs whitespace-pre-wrap">
          ✓ 24 passed, 0 failed
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Check />
            </TraceIcon>
            <TraceTitle>Installed dependencies</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="font-mono text-xs whitespace-pre-wrap">
          added 412 packages in 18s
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

function DemoCarousel() {
  return (
    <Carousel className="max-w-xs">
      <CarouselContent>
        {["One", "Two", "Three"].map((label) => (
          <CarouselItem key={label}>
            <div className="grid h-32 place-items-center rounded-xl border text-sm text-muted-foreground">
              Slide {label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

const CHART_CONFIG = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
} satisfies ChartConfig

function DemoChart() {
  return (
    <ChartContainer config={CHART_CONFIG} className="h-40 w-full max-w-md">
      <AreaChart
        data={[
          { month: "Jan", visitors: 120 },
          { month: "Feb", visitors: 220 },
          { month: "Mar", visitors: 180 },
          { month: "Apr", visitors: 260 },
        ]}
      >
        <Area
          dataKey="visitors"
          type="monotone"
          fill="var(--color-visitors)"
          fillOpacity={0.2}
          stroke="var(--color-visitors)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function DemoChat() {
  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="h-64 max-w-md rounded-xl border">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-4 p-4">
            <MessageScrollerItem messageId="demo-user" scrollAnchor>
              <Message align="end">
                <MessageContent>
                  <Bubble align="end">
                    <BubbleContent>
                      Can the design tokens theme every component?
                    </BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageScrollerItem>
            <MessageScrollerItem messageId="demo-assistant">
              <Message>
                <MessageContent>
                  <Bubble variant="muted">
                    <BubbleContent>
                      Yes — colors, fonts, radius and shadows are all CSS
                      variables, so every component on this page picks them up.
                    </BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

function DemoSidebar() {
  return (
    <div className="relative h-72 max-w-md overflow-hidden rounded-xl border">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar collapsible="icon" className="absolute inset-y-0 h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Gallery">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                    D
                  </span>
                  <span className="truncate font-medium">Design</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Home" isActive>
                      <Bell />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <div className="flex items-center gap-2 p-3">
            <SidebarTrigger className="-ml-1" />
            <span className="text-sm text-muted-foreground">Inset content</span>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function DemoQuestionnaire() {
  return (
    <Questionnaire
      className="max-w-md"
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireItem name="plan" required>
        <QuestionnaireTitle>Which plan fits your team?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="free">
            Free
            <QuestionnaireChoiceDescription>
              For solo builders
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="pro">
            Pro
            <QuestionnaireChoiceDescription>
              Everything unlocked
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions className="flex justify-end gap-2">
        <QuestionnairePrevious />
        <QuestionnaireNext />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
