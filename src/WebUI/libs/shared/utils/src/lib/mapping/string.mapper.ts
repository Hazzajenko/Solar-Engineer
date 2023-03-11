import { StringModel } from '@shared/data-access/models'
import { cast, uncast } from './mapper.helpers'
import { z } from 'zod'

export class StringMapper {
  public static toStringModel(json: string): StringModel {
    return cast(JSON.parse(json), r('StringModel'))
  }

  public static stringModelToJson(value: StringModel): string {
    return JSON.stringify(uncast(value, r('StringModel')), null, 2)
  }
}

export const StringSchemaModel = z.object({
  Type: z.string(),
  StringId: z.string(),
  PanelConfigId: z.string(),
  ProjectId: z.string(),
  Location: z.string(),
  Rotation: z.number(),
  Id: z.string(),
  CreatedTime: z.string(),
  LastModifiedTime: z.string(),
  CreatedById: z.string(),
})

export type StringJsonModel = z.infer<typeof StringSchemaModel>

// stringSchema.parse();
//
/*export function verifyResponseType<T extends z.ZodTypeAny>(zodObj: T) {
  return pipe(map((response) => zodObj.parse(response)));
}*/
function r(name: string) {
  return { ref: name }
}

/*const typeMap: any = {
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
}*/

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
