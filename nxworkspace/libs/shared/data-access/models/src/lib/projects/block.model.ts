export interface BlockOptions {
  id: string
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

  constructor(options: BlockOptions) {
    this.id = options.id
    this.projectId = options.projectId
    this.location = options.location
    this.type = options.type
  }
}
