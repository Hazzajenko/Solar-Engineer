import { PanelModel } from '@shared/data-access/models'
import { cast, uncast } from './mapper.helpers'
import { z } from 'zod'

export class PanelMapper {
  public static toPanelModel(json: string): PanelModel {
    return cast(JSON.parse(json), r('PanelModel'))
  }

  public static panelModelToJson(value: PanelModel): string {
    return JSON.stringify(uncast(value, r('PanelModel')), null, 2)
  }
}

export const PanelSchemaModel = z.object({
  type: z.string(),
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

export type PanelJsonModel = z.infer<typeof PanelSchemaModel>

function r(name: string) {
  return { ref: name }
}

/*
const typeMap: any = {
  PanelModel: o(
    [
      { json: 'Type', js: 'type', typ: '' },
      { json: 'StringId', js: 'stringId', typ: '' },
      { json: 'PanelConfigId', js: 'panelConfigId', typ: '' },
      { json: 'ProjectId', js: 'projectId', typ: '' },
      { json: 'Location', js: 'location', typ: '' },
      { json: 'Rotation', js: 'Rotation', typ: 0 },
      { json: 'Id', js: 'id', typ: '' },
      { json: 'CreatedTime', js: 'createdTime', typ: Date },
      { json: 'LastModifiedTime', js: 'lastModifiedTime', typ: Date },
      { json: 'CreatedById', js: 'createdById', typ: '' },
    ],
    false,
  ),
}
*/
