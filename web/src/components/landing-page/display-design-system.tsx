import { ChevronDown } from "lucide-react"
import { FigmaIcon } from "../shared/figma-icon"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Bubble, BubbleContent, BubbleReactions } from "../ui/bubble"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { Field, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"
import { ComponentContainer } from "../shared/component-container"

export function DisplayDesignSystem() {
  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <Left />
      <Right />
    </section>
  )
}

function Left() {
  return (
    <div className="space-y-8">
      <ComponentContainer className="text-center">
        <div className="space-y-1 border-b p-6">
          <h3 className="font-semibold">Sign in to your account</h3>
          <p className="text-muted-foreground">Login with your credential</p>
        </div>

        <div className="space-y-6 p-6">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input placeholder="Enter your email" />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input placeholder="Enter your password" />
          </Field>
          <Button className={"w-full"}>Sign In</Button>
          <p>
            Don't have an account? <span className="underline">Sign up</span>
          </p>
        </div>
      </ComponentContainer>

      <ComponentContainer className="p-6">
        <div className="flex items-center justify-center gap-2">
          <img src="/iroha-logo.svg" alt="Iroha Logo" className="size-8" />
          <div className="flex-1 text-left">
            <h3 className="font-semibold">Iroha</h3>
            <p className="text-xs text-muted-foreground">
              Design System Generator
            </p>
          </div>
          <Button>
            <FigmaIcon />
            Try
          </Button>
        </div>
      </ComponentContainer>

      <ComponentContainer className="p-6">
        <Collapsible>
          <CollapsibleTrigger
            render={
              <Button variant={"ghost"} className={"w-full justify-between"}>
                What is Iroha?
                <ChevronDown />
              </Button>
            }
          />
          <CollapsibleContent
            className={"mt-4 leading-relaxed text-muted-foreground"}
          >
            Iroha is a tool for creating design system variables and styles
            quickly for Figma. Built to work easily with minimal effort.
          </CollapsibleContent>
        </Collapsible>
      </ComponentContainer>
    </div>
  )
}

function Right() {
  return (
    <div className="space-y-8">
      <ComponentContainer className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button>Button</Button>
            <Button variant={"secondary"}>Secondary</Button>
            <Button variant={"outline"}>Outline</Button>
          </div>

          <div className="space-y-6">
            <Input placeholder="Name" />
            <Textarea placeholder="Message" />
          </div>

          <div className="flex items-center gap-2">
            <Badge>Badge</Badge>
            <Badge variant={"secondary"}>Secondary</Badge>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroup className={"flex"} defaultValue={"hello"}>
              <RadioGroupItem value={"hello"} />
              <RadioGroupItem value={"world"} />
            </RadioGroup>
            <Checkbox defaultChecked />
            <Switch defaultChecked />
          </div>
        </div>
      </ComponentContainer>

      <ComponentContainer>
        <div className="flex items-center gap-4 border-b p-6">
          <Avatar size="lg">
            <AvatarImage src="/aimyon.jpg" />
          </Avatar>
          <div>
            <h3 className="font-semibold">Aimyon</h3>
            <p className="text-xs text-muted-foreground">Singer</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <Bubble align="end">
            <BubbleContent>
              I like your music! Especially your song "Belt of Venus". It's so
              beautiful and emotional.
            </BubbleContent>
          </Bubble>
          <Bubble variant={"muted"}>
            <BubbleContent>
              Thank you for your kind words! I'm glad you enjoy my music. I'm
              happy to hear that it resonates with you.
            </BubbleContent>
            <BubbleReactions>❤️</BubbleReactions>
          </Bubble>
        </div>
      </ComponentContainer>
    </div>
  )
}
