import { getGuid } from '@shared/utils'

export interface EntityOptions {
  projectId: string
  // type: EntityType
  id?: string
}

export const ENTITY_TYPE = {
  UNDEFINED: 'UNDEFINED',
  TRACKER: 'TRACKER',
  STRING: 'STRING',
  PANEL_LINK: 'PANEL_LINK',
  PANEL_CONFIG: 'PANEL_CONFIG',
} as const

export type EntityType = typeof ENTITY_TYPE[keyof typeof ENTITY_TYPE]
// const hi : EntityType = 'UNDEFINED'
/*export enum EntityType {
  UNDEFINED,
  TRACKER,
  STRING,
  LINK,
}*/

export class EntityModel {
  id: string
  projectId: string
  type: EntityType = ENTITY_TYPE.UNDEFINED

  constructor(options: EntityOptions) {
    this.id = options.id ? options.id : getGuid()
    this.projectId = options.projectId
  }
}
