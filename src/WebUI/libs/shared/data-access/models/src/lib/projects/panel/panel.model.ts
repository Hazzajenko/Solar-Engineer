import { BLOCK_TYPE, BlockModel } from '../block.model'
import { PanelOptions } from './panel.options'
import { IEntity } from '../interfaces'
import { IUserObject } from '../interfaces/i-user-object.interface'
import { IPanel } from './i-panel.interface'
import { getGuid } from '@shared/utils'


export class PanelModel extends BlockModel implements IEntity, IUserObject, IPanel {
  override type = BLOCK_TYPE.PANEL
  stringId: string
  rotation: number
  panelConfigId: string
  createdById: string
  createdTime: string
  lastModifiedTime: string

  constructor(options: PanelOptions) {
    super(options)
    this.id = getGuid()
    this.rotation = options.rotation
    this.projectId = options.projectId
    this.location = options.location
    this.stringId = options.stringId
    this.panelConfigId = options.panelConfigId
    this.createdById = options.createdById
    this.createdTime = new Date().toISOString()
    this.lastModifiedTime = new Date().toISOString()
  }
}
