import z from "zod"

export const designSchema = z.object({
  name: z.string().min(1, "Design name is required"),
  description: z.string().optional(),
})

export type DesignSchema = z.infer<typeof designSchema>
