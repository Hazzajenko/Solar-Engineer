import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface BlockModel {
  id: string
  location: string
  // id: string
  project_id: number
  color?: string
  // location: string
  model: UnitModel
  type?: TypeModel
}
