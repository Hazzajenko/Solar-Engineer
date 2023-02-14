import { BlocksFacade } from '@project-id/data-access/facades'
import { getGuid } from '@shared/utils'
import { firstValueFrom } from 'rxjs'
import { BlockService } from './block.service'


export interface BlockOptions {
  id?: string
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

interface BlockModel {
  id: string
  projectId: number
  location: string
  type: BlockType
}

export class Block implements BlockModel {
  id: string
  projectId: number
  location: string
  type: BlockType
  private service: BlockService

  constructor(bF: BlockService, options: BlockOptions) {
    this.service = bF
    this.id = options.id ? options.id : getGuid.toString()
    this.projectId = options.projectId
    this.location = options.location
    this.type = options.type
  }

  update() {
    return this.service.getChild(this.id, this.type)
  }

  getChild$() {
    return this.service.getChild(this.id, this.type)
  }

  getChild() {
    return firstValueFrom(this.service.getChild(this.id, this.type))
  }
}


export interface PanelOptions extends BlockOptions {
  stringId: string
  rotation: number
}

export class PanelModel {
  block: Block


  constructor(block: Block) {
    this.block = block
  }

/*   init() {
    this.block.
  } */
}

const bf = new BlockService()
const block = new Block(bf, {type: 1, location: 'asd', projectId: 1})

const panel = new PanelModel(block)

panel.block.getChild