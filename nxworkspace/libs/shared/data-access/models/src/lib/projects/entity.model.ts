export interface EntityOptions {
  id: string
  projectId: number
  type: EntityType
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
  type: EntityType

  constructor(options: EntityOptions) {
    this.id = options.id
    this.projectId = options.projectId
    this.type = options.type
  }
}
