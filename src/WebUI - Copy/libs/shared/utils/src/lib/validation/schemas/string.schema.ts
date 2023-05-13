import { z } from 'zod'

export const StringTextSchema = z.string()
export type StringTextSchemaModel = z.infer<typeof StringTextSchema>
