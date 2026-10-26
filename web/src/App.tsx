import { Routes, Route } from "react-router"
import { Dashboard } from "./pages/dashboard"
import { Home } from "./pages/home"
import { DashboardLayout } from "./layout/dashboard-layout"
import { Typography } from "./pages/typography"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/typography" element={<Typography />} />
      </Route>
    </Routes>
  )
}

export default App
