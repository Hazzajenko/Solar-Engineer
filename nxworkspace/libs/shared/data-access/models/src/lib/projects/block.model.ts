import { getGuid } from '@shared/utils'

export interface BlockOptions {
  projectId: number
  location: string
  type: BlockType
}

export enum BlockType {
  UNDEFINED,
  INVERTER,
  PANEL,
  CABLE,
  DISCONNECTIONPOINT,
  TRAY,
  RAIL,
}

export class BlockModel {
  id: string
  projectId: number
  location: string
  type: BlockType

  constructor(options: BlockOptions, id?: string) {
    this.id = id ? id : getGuid.toString()
    this.projectId = options.projectId
    this.location = options.location
    this.type = options.type
  }
}
