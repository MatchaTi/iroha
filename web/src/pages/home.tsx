import { CTA } from "@/components/landing-page/cta"
import { Footer } from "@/components/landing-page/footer"
import { Hero } from "@/components/landing-page/hero"
import { Navbar } from "@/components/landing-page/navbar"
import "lenis/dist/lenis.css"
import { ReactLenis } from "lenis/react"

export function Home() {
  return (
    <div>
      <ReactLenis root />
      <Navbar />
      <Hero />
      <CTA />
      <Footer />
    </div>
  )
}
