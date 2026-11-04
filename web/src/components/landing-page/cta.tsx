import { Link } from "react-router"
import { Button } from "../ui/button"
import { FigmaIcon } from "../shared/figma-icon"
import { GithubIcon } from "../shared/github-icon"

export function CTA() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 text-center lg:px-60">
      <div className="pattern absolute top-0 left-0 z-0 h-full w-full" />
      <div className="z-10 space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl text-balance lg:text-7xl">
            Use this if you very{" "}
            <span className="relative border-x-4 border-primary bg-primary/40">
              <span className="absolute top-0 -left-0.5 block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
              <span className="absolute -right-0.5 bottom-0 block size-4 translate-x-1/2 translate-y-1/2 rounded-full bg-primary" />
              lazy
            </span>{" "}
            to create design system from scratch
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            className={"px-8 py-6"}
            render={
              <Link to={"/new"}>
                <FigmaIcon />
                Try on Figma
              </Link>
            }
          />
          <Button
            className={"px-8 py-6"}
            variant={"ghost"}
            render={
              <a href="https://github.com/MatchaTi/iroha" target="_blank">
                <GithubIcon /> Star on GitHub
              </a>
            }
          />
        </div>
      </div>
    </section>
  )
}
