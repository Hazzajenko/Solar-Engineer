import { z } from 'zod'

const createSchema = <T>(valueSchema: z.ZodSchema<T>) =>
  z.object({
    name: z.string(),
    value: valueSchema,
  })

export type ZodSchemaFactory<T> = z.infer<ReturnType<typeof createSchema<T>>>

const updateSchema = <T>(valueSchema: z.ZodSchema<T>) =>
  z.object({
    id: z.string(),
    changes: valueSchema.optional(),
  })

export type ZodUpdateSchema<T> = z.infer<ReturnType<typeof updateSchema<T>>>
