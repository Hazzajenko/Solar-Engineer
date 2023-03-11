import { z } from 'zod'

export const PanelLinkSchemaModel = z.object({
  /*  type: z.string(),
    panelPositiveToId: z.string(),
    // panelPositiveToId
    panelNegativeToId: z.string(),
    projectId: z.string(),
    id: z.string(),
    createdTime: z.string(),
    lastModifiedTime: z.string(),
    createdById: z.string(),*/
  type: z.string(),
  panelPositiveToId: z.string(),
  panelNegativeToId: z.string(),
  projectId: z.string(),
  id: z.string(),
  createdTime: z.string(),
  lastModifiedTime: z.string(),
  createdById: z.string(),
})

export type PanelLinkJsonModel = z.infer<typeof PanelLinkSchemaModel>
