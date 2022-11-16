import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface ProjectModel {
  id: number
  name: string
  model?: UnitModel
  type?: TypeModel
  created_by: number
  created_at: string
  inverter_amount: number
  tracker_amount: number
  parallel_amount: number
  string_amount: number
  panel_amount: number
  project_members_length: number
}
