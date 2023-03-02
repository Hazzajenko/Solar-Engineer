import { getGuid } from '@shared/utils'

export interface EntityOptions {
  projectId: string
  // type: EntityType
  id?: string
}

export enum EntityType {
  UNDEFINED,
  TRACKER,
  STRING,
  LINK,
}

export class EntityModel {
  id: string
  projectId: string
  type: EntityType = EntityType.UNDEFINED

  constructor(options: EntityOptions) {
    this.id = options.id ? options.id : getGuid.toString()
    this.projectId = options.projectId
  }
}
