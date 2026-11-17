import { Routes, Route } from "react-router"
import { Home } from "./pages/home"
import { DashboardLayout } from "./layout/dashboard-layout"
import { About } from "./pages/about"
import { DesignLayout } from "./layout/design-layout"
import { DesignDetails } from "./pages/designs/design-details"
import { ColorPalettePage } from "./pages/designs/color-palette"
import { NewDesign } from "./pages/new-design"
import { DesignThemeStyle } from "./components/designs/design-theme-style"
import { TypographyPage } from "./pages/designs/typography"
import { ShapePage } from "./pages/designs/shape"
import { DashboardPreview } from "./pages/designs/dashboard"
import { LandingPagePreview } from "./pages/designs/landing-page"
import { AiChatPreview } from "./pages/designs/ai-chat"

export function App() {
  return (
    <>
      <DesignThemeStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<DashboardLayout />}>
          <Route path="/new" element={<NewDesign />} />

          <Route element={<DesignLayout />}>
            <Route index path="/designs/:id" element={<DesignDetails />} />
            <Route
              path="/designs/:id/color-palette"
              element={<ColorPalettePage />}
            />
            <Route
              path="/designs/:id/typography"
              element={<TypographyPage />}
            />
            <Route path="/designs/:id/shape" element={<ShapePage />} />
            <Route
              path="/designs/:id/dashboard"
              element={<DashboardPreview />}
            />
            <Route
              path="/designs/:id/landing-page"
              element={<LandingPagePreview />}
            />
            <Route
              path="/designs/:id/ai-chat"
              element={<AiChatPreview />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
