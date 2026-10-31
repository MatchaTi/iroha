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

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<DashboardLayout />}>
        <Route path="/new" element={<NewProject />} />
        <Route element={<ProjectLayout />}>
          <Route index path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/typography" element={<Typography />} />
          <Route
            path="/projects/:id/color-palette"
            element={<ColorPalette />}
          />
          <Route path="/projects/:id/corner" element={<Corner />} />
          <Route path="/projects/:id/shadow" element={<Shadow />} />
          <Route path="/projects/:id/button" element={<DSButton />} />
          <Route path="/projects/:id/input" element={<DSInput />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
