import { BlockModel } from '../block'
import { IEntity } from '../interfaces'
import { IUserObject } from '../interfaces/i-user-object.interface'
import { ProjectModelType } from '../model'
import { IPanel } from './i-panel.interface'
import { PanelOptions } from './panel.options'
import { newGuid } from '@shared/utils'


export class GridPanelModel extends BlockModel implements IEntity, IUserObject, IPanel {
  /*, IBlockJson<PanelModel>*/
  override type = ProjectModelType.Panel
  // override type = BLOCK_TYPE.PANEL
  stringId: string
  rotation: number
  panelConfigId: string
  createdById: string
  createdTime: string
  lastModifiedTime: string

  constructor(options: PanelOptions) {
    super(options)
    this.id = newGuid()
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