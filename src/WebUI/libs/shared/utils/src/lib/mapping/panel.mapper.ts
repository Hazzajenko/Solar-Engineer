/*export const PanelSchemaModel = z.object({
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

export type PanelJsonModel = z.infer<typeof PanelSchemaModel>
export const PanelSchemaArrayModel = z.array(PanelSchemaModel)
export type PanelArrayJsonModel = z.infer<typeof PanelSchemaArrayModel>*/

/*const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(JsonSchema), z.record(JsonSchema)]),
)*/
// jsonSchema.
// jsonSchema.parse(data);

/*export type PanelJsonArrayModel = z.infer<typeof PanelSchemaArrayModel>
export type PanelJsonArrayModel2 = z.infer<typeof PanelSchemaArrayModel2>
type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
  G,
>() => G extends U ? 1 : 2
  ? Y
  : N

type T0 = IfEquals<PanelJsonArrayModel, PanelJsonArrayModel2, 'yes', 'no'> // yes
type T02 = IfEquals<PanelJsonArrayModel, PanelJsonModel, 'yes', 'no'>
type EQ = IfEquals<any[], [number][], 'same', 'different'> // "different"
type EQ1 = IfEquals<{ a: string } & { b: number }, { a: string; b: number }, 'same', 'different'> // "different"!*/

// const isTrue = PanelJsonArrayModel === PanelJsonArrayModel2

/*function r(name: string) {
  return { ref: name }
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
