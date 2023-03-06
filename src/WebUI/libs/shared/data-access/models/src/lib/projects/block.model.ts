import { getGuid } from '@shared/utils'

export interface BlockOptions {
  projectId: string
  location: string
  // type: BlockType
}

export const BLOCK_TYPE = {
  UNDEFINED: 'UNDEFINED',
  INVERTER: 'INVERTER',
  PANEL: 'PANEL',
  CABLE: 'CABLE',
  DISCONNECTIONPOINT: 'DISCONNECTIONPOINT',
  TRAY: 'TRAY',
  RAIL: 'RAIL',
} as const

export type BlockType = typeof BLOCK_TYPE[keyof typeof BLOCK_TYPE]

/*export enum BlockType {
  UNDEFINED,
  INVERTER,
  PANEL,
  CABLE,
  DISCONNECTIONPOINT,
  TRAY,
  RAIL,
}*/

export class BlockModel {
  id: string
  projectId: string
  location: string
  type: BlockType = BLOCK_TYPE.UNDEFINED

  constructor(options: BlockOptions, id?: string) {
    this.id = id ? id : getGuid()
    this.projectId = options.projectId
    this.location = options.location
    // this.type = options.type
  }
}
