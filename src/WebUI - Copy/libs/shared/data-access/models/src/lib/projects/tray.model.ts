import { BlockModel, BlockOptions } from './block/block.model'
import { ProjectModelType } from './model'
import { newGuid } from '@shared/utils'

export interface TrayOptions extends BlockOptions {
  size: number
}

export class TrayModel extends BlockModel {
  size: number

  constructor(options: TrayOptions) {
    super(options)
    this.id = newGuid()
    this.projectId = options.projectId
    this.type = ProjectModelType.Tray
    // this.type = BLOCK_TYPE.TRAY
    this.location = options.location
    this.size = options.size
  }
}