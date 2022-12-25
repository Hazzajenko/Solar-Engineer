import { getGuid } from '@shared/utils'
import { BlockModel, BlockOptions, BlockType } from './block.model'

export interface TrayOptions extends BlockOptions {
  size: number
}

export class TrayModel extends BlockModel {
  size: number

  constructor(options: TrayOptions) {
    super(options)
    this.id = getGuid().toString()
    this.projectId = options.projectId
    this.type = BlockType.TRAY
    this.location = options.location
    this.size = options.size
  }
}
