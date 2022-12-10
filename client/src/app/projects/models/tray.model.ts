import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'
import { Guid } from 'guid-typescript'

export class TrayModel {
  id: string
  projectId?: number
  model: UnitModel
  type: TypeModel
  location: string
  size: number
  color?: string

  constructor(projectId: number, location: string, size: number) {
    this.id = Guid.create().toString()
    this.projectId = projectId
    this.model = UnitModel.TRAY
    this.type = 'TRAY'
    this.location = location
    this.size = size
    this.color = 'BLACK'
  }
}
