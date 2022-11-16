import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface CableModel {
  id: number
  project_id?: number
  model?: UnitModel
  type?: TypeModel
  location: string
  size?: number
  length?: number
  weight?: number
  created_at?: string
  color?: string
  version?: number
}
