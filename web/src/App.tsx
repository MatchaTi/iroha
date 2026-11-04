import { Routes, Route } from "react-router"
import { Home } from "./pages/home"
import { DashboardLayout } from "./layout/dashboard-layout"
import { Typography } from "./pages/typography"
import { NewProject } from "./pages/new-project"
import { ProjectDetails } from "./pages/project-details"
import { ProjectLayout } from "./layout/project-layout"
import { ColorPalette } from "./pages/color-palette"
import { Corner } from "./pages/corner"
import { Shadow } from "./pages/shadow"
import { DSButton } from "./pages/ds-button"
import { DSInput } from "./pages/ds-input"
import { DSTextarea } from "./pages/ds-textarea"
import { DSBadge } from "./pages/ds-badge"
import { DSCheckbox } from "./pages/ds-checkbox"
import { DSSwitch } from "./pages/ds-switch"
import { DSRadio } from "./pages/ds-radio"
import { DSSlider } from "./pages/ds-slider"
import { DesignMD } from "./pages/design-md"
import { BrandKit } from "./pages/brand-kit"
import { About } from "./pages/about"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route element={<DashboardLayout />}>
        <Route path="/new" element={<NewProject />} />
        <Route element={<ProjectLayout />}>
          <Route index path="/projects/:id" element={<ProjectDetails />} />
          <Route index path="/projects/:id/brand-kit" element={<BrandKit />} />
          <Route index path="/projects/:id/icon" element={<BrandKit />} />
          <Route path="/projects/:id/typography" element={<Typography />} />
          <Route
            path="/projects/:id/color-palette"
            element={<ColorPalette />}
          />
          <Route path="/projects/:id/corner" element={<Corner />} />
          <Route path="/projects/:id/shadow" element={<Shadow />} />
          <Route path="/projects/:id/button" element={<DSButton />} />
          <Route path="/projects/:id/input" element={<DSInput />} />
          <Route path="/projects/:id/textarea" element={<DSTextarea />} />
          <Route path="/projects/:id/badge" element={<DSBadge />} />
          <Route path="/projects/:id/checkbox" element={<DSCheckbox />} />
          <Route path="/projects/:id/switch" element={<DSSwitch />} />
          <Route path="/projects/:id/radio" element={<DSRadio />} />
          <Route path="/projects/:id/slider" element={<DSSlider />} />
          <Route path="/projects/:id/design-md" element={<DesignMD />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
