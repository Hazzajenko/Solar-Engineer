import { ProjectModelType } from './model'
import { newGuid } from '@shared/utils'

export interface EntityOptions {
  projectId: string
  // type: EntityType
  id?: string
}

export const ENTITY_TYPE_DEPRECATED = {
  UNDEFINED: 'UNDEFINED',
  TRACKER: 'TRACKER',
  STRING: 'STRING',
  PANEL_LINK: 'PANEL_LINK',
  PANEL_CONFIG: 'PANEL_CONFIG',
} as const

export type EntityTypeDeprecated =
  (typeof ENTITY_TYPE_DEPRECATED)[keyof typeof ENTITY_TYPE_DEPRECATED]
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
  type: ProjectModelType = ProjectModelType.Undefined

  // type: EntityType = ENTITY_TYPE.UNDEFINED

  constructor(options: EntityOptions) {
    this.id = options.id ? options.id : newGuid()
    this.projectId = options.projectId
  }
}