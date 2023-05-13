import { cast, uncast } from './mapper.helpers'
import { GridStringModel } from '@shared/data-access/models'
import { z } from 'zod'

export class StringMapper {
  public static toStringModel(json: string): GridStringModel {
    return cast(JSON.parse(json), r('StringModel'))
  }

  public static stringModelToJson(value: GridStringModel): string {
    return JSON.stringify(uncast(value, r('StringModel')), null, 2)
  }
}

export const StringSchema = z.object({
  type: z.string(),
  name: z.string(),
  color: z.string(),
  parallel: z.boolean(),
  projectId: z.string(),
  id: z.string(),
  createdTime: z.string(),
  lastModifiedTime: z.string(),
  createdById: z.string(),
})

export type StringSchemaModel = z.infer<typeof StringSchema>

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