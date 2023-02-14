import { getGuid } from '@shared/utils'

export interface EntityOptions {
  projectId: number
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
  projectId: number
  type: EntityType = EntityType.UNDEFINED

  constructor(options: EntityOptions) {
    this.id = options.id ? options.id : getGuid.toString()
    this.projectId = options.projectId
  }
}
