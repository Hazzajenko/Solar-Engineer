import { z } from 'zod'
import { ProjectModelType } from '@shared/data-access/models'

export const PanelSchema = z.object({
  type: z.string().refine((val) => val == ProjectModelType.Panel),
  stringId: z.string(),
  panelConfigId: z.string(),
  projectId: z.string(),
  location: z.string(),
  rotation: z.number(),
  id: z.string(),
  createdTime: z.string(),
  lastModifiedTime: z.string(),
  createdById: z.string(),
})

export const PartialPanelSchema = PanelSchema.partial()

export type PanelSchemaModel = z.infer<typeof PanelSchema>
export type PartialPanelSchemaModel = z.infer<typeof PartialPanelSchema>
export const PanelArraySchema = z.array(PanelSchema)
export type PanelArraySchemaModel = z.infer<typeof PanelArraySchema>
