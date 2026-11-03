import { PROJECT_NAME } from "@/lib/constants"
import { Link } from "react-router"
import { GithubIcon } from "../shared/github-icon"
import { ThemeToggle } from "../shared/theme-toggle"
import { Button } from "../ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between gap-2 p-4 lg:px-60">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg text-background">
          <img src={'/iroha-logo.svg'} alt="Iroha Logo" className="size-6" />
        </div>
        <span className="font-architects-daughter font-semibold">
          {PROJECT_NAME}
        </span>
      </Link>
      <section className="hidden gap-2 lg:flex lg:items-center">
        <Button variant={"link"} size="lg" render={<Link to="/about">About</Link>} />
        <Button
          size="lg"
          variant={"link"}
          render={
            <a
              href="https://github.com/MatchaTi/iroha"
              target="_blank"
              no-referrer
            >
              <GithubIcon />
              GitHub
            </a>
          }
        />
        <Button size="lg" render={<Link to="/new">Create One</Link>} />
        <ThemeToggle />
      </section>
    </nav>
  )
}
