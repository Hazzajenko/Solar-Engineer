import { TypeModel } from '../../../../../../../libs/shared/data-access/models/src/lib/type.model'
import { Guid } from 'guid-typescript'

export enum RailType {
  UNDEFINED,
  SUNLOCK,
  CLENERGY,
}

export class RailModel {
  id: string
  project_id?: number
  model: TypeModel
  type: RailType
  location: string
  is_child_block: boolean
  parent_block_id?: string

  constructor(projectId: number, location: string, isChildBlock: boolean, parentBlockId?: string) {
    this.id = Guid.create().toString()
    this.project_id = projectId
    this.model = TypeModel.TRAY
    this.type = RailType.SUNLOCK
    this.location = location
    this.is_child_block = isChildBlock
    this.parent_block_id = parentBlockId
  }
}
