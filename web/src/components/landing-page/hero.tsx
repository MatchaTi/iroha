import { Link } from "react-router"
import { PROJECT_NAME } from "@/lib/constants"
import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { GithubIcon } from "../shared/github-icon"
import { AnimatedCursor } from "./animated-cursor"

export function Hero() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 text-center lg:px-60">
      <div className="pattern absolute top-0 left-0 z-0 h-full w-full" />
      <AnimatedCursor />
      <div className="z-10 max-w-2xl space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-7xl">
            Create Design Systems{" "}
            <span className="font-architects-daughter">Variables</span> and{" "}
            <span className="font-architects-daughter">Styles</span> Quickly
          </h1>
          <p className="text-lg text-balance text-muted-foreground">
            {PROJECT_NAME} is a tool for creating design system variables and
            styles quickly for Figma. Built to work easily with minimal effort.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            className={"px-8 py-6"}
            render={
              <Link to={"/new"}>
                Get Started <ArrowRight />
              </Link>
            }
          />
          <Button
            variant={"ghost"}
            render={
              <a href="https://github.com/MatchaTi/iroha" target="_blank">
                <GithubIcon /> Star on GitHub
              </a>
            }
          />
        </div>
      </div>
    </main>
  )
}
