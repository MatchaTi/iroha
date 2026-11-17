import {
  ArrowRight,
  Check,
  Layout,
  Maximize2,
  Minimize2,
  Moon,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { cn } from "cn"

/**
 * Landing page preview for the active design. Plain components — it picks
 * up the design's colors, fonts, radius and shadows automatically.
 */
export function LandingPagePreview() {
  const { ref, isFullscreen, toggle } = useFullscreen<HTMLElement>()

  return (
    <main
      ref={ref}
      className={cn(
        "min-h-full bg-background",
        isFullscreen && "h-screen overflow-y-auto"
      )}
    >
      {/* Nav */}
      <header className="border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-heading font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Rocket className="size-4" />
            </span>
            Acme
          </div>
          <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              onClick={toggle}
            >
              {isFullscreen ? <Minimize2 /> : <Maximize2 />}
            </Button>
            <Button variant="ghost" size="icon">
              <Moon />
            </Button>
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="size-3" />
          Introducing Acme 2.0
        </Badge>
        <h1 className="font-heading mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Ship your product at the speed of thought
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Acme gives your team the building blocks to design, prototype and
          launch — all in one place, beautifully consistent on every screen.
        </p>
        <div className="mx-auto mt-8 flex max-w-md items-center gap-2">
          <Input placeholder="you@company.com" type="email" />
          <Button className="shrink-0">
            Get Started <ArrowRight />
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Free 14-day trial · No credit card required
        </p>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 space-y-2 text-center">
          <h2 className="font-heading text-3xl font-semibold">
            Everything you need
          </h2>
          <p className="text-muted-foreground">
            One toolkit, endless possibilities.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={Zap}
            title="Blazing fast"
            description="Optimized defaults that keep every interaction under a frame budget."
          />
          <FeatureCard
            icon={Layout}
            title="Composable blocks"
            description="Hundreds of blocks that snap together without fighting your styles."
          />
          <FeatureCard
            icon={Shield}
            title="Accessible by default"
            description="WAI-ARIA compliant primitives with keyboard support out of the box."
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 space-y-2 text-center">
          <h2 className="font-heading text-3xl font-semibold">Pricing</h2>
          <p className="text-muted-foreground">
            Start free, upgrade when you grow.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <PricingCard
            name="Free"
            price="$0"
            description="For side projects and trying things out."
            features={["3 projects", "Community support", "Basic analytics"]}
            cta="Start for free"
          />
          <PricingCard
            name="Pro"
            price="$20"
            period="/month"
            description="For professional builders and small teams."
            features={[
              "Unlimited projects",
              "Priority support",
              "Advanced analytics",
              "Custom domains",
            ]}
            cta="Get started"
            highlight
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            description="For organizations with advanced needs."
            features={[
              "SSO & SAML",
              "Dedicated support",
              "SLA guarantee",
              "Audit logs",
            ]}
            cta="Contact sales"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-5xl space-y-4 px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-heading font-semibold">
              <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Rocket className="size-4" />
              </span>
              Acme
            </div>
            <div className="flex gap-5 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground">
                Features
              </a>
              <a href="#pricing" className="hover:text-foreground">
                Pricing
              </a>
              <a href="#faq" className="hover:text-foreground">
                FAQ
              </a>
            </div>
          </div>
          <Separator />
          <p className="text-center text-xs text-muted-foreground">
            © 2026 Acme Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
}) {
  return (
    <Card className="text-center">
      <CardContent className="space-y-3">
        <span className="mx-auto grid size-10 place-items-center rounded-full bg-muted">
          <Icon className="size-5 text-primary" />
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function PricingCard({
  name,
  price,
  period = "",
  description,
  features,
  cta,
  highlight = false,
}: {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  highlight?: boolean
}) {
  return (
    <Card className={cn(highlight && "border-ring ring-2 ring-ring")}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          <span className="text-3xl font-semibold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </p>
        <ul className="space-y-2 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          className="w-full"
          variant={highlight ? "default" : "outline"}
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  )
}
