import { BlockModel } from '../block/block.model'
import { IEntity } from '../interfaces'
import { IUserObject } from '../interfaces/i-user-object.interface'
import { ProjectModelType } from '../model'
import { IPanel } from './i-panel.interface'
import { PanelOptions } from './panel.options'
import { newGuid } from '@shared/utils'


export class PanelModel extends BlockModel implements IEntity, IUserObject, IPanel {
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

  /* static fromSerialized<PanelModel>(serialized: string) {
   // const user: ReturnType<PanelModel.toObject> = JSON.parse(serialized)
   // const user: ReturnType<PanelModel['toObject']> = JSON.parse(serialized)
   const panel: PanelModel = JSON.parse(serialized)

   /!*   return new PanelModel({
   // id: user.id,
   stringId: panel.stringId,
   rotation: panel.rotation,
   panelConfigId: panel.panelConfigId,
   projectId: panel.projectId,
   location: panel.location,
   createdById: panel.createdById,
   // createdTime: user.createdTime,
   // lastModifiedTime: user.lastModifiedTime,
   })*!/
   }

   private toObject() {
   return {
   id: this.id,
   stringId: this.stringId,
   rotation: this.rotation,
   panelConfigId: this.panelConfigId,
   projectId: this.projectId,
   location: this.location,
   createdById: this.createdById,
   createdTime: this.createdTime,
   lastModifiedTime: this.lastModifiedTime,
   }
   }

   serialize() {
   return JSON.stringify(this.toObject())
   }*/

  /*  fromSerialized<PanelModel>(serialized: string): PanelModel {
   // return undefined
   }*/
}