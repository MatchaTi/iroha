import { useParams } from "react-router"

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>()

  return <main>Project Details: {id}</main>
}
