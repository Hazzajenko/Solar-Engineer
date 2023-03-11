import { getGuid } from '@shared/utils'
import { BlockModel, BlockOptions } from './block/block.model'
import { ProjectModelType } from './model'

export interface TrayOptions extends BlockOptions {
  size: number
}

export class TrayModel extends BlockModel {
  size: number

  constructor(options: TrayOptions) {
    super(options)
    this.id = getGuid()
    this.projectId = options.projectId
    this.type = ProjectModelType.Tray
    // this.type = BLOCK_TYPE.TRAY
    this.location = options.location
    this.size = options.size
  }
}
