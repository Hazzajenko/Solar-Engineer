import { getGuid } from '@shared/utils'
import { BLOCK_TYPE, BlockModel, BlockOptions } from './block/block.model'

export interface TrayOptions extends BlockOptions {
  size: number
}

export class TrayModel extends BlockModel {
  size: number

  constructor(options: TrayOptions) {
    super(options)
    this.id = getGuid()
    this.projectId = options.projectId
    this.type = BLOCK_TYPE.TRAY
    this.location = options.location
    this.size = options.size
  }
}
