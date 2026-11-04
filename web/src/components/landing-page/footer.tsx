import { PROJECT_NAME_JP } from "@/lib/constants"
import { Link } from "react-router"

export function Footer() {
  return (
    <footer className="flex items-center justify-between gap-2 p-4 lg:px-60">
      <p>
        Created by{" "}
        <a
          href="https://shimamura.dev"
          target="_blank"
          className="font-architects-daughter"
        >
          Syifai
        </a>
      </p>
      <Link to="/" className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg text-background">
          <img src={"/iroha-logo.svg"} alt="Iroha Logo" className="size-6" />
        </div>
        <span className="font-semibold">{PROJECT_NAME_JP}</span>
      </Link>
    </footer>
  )
}
