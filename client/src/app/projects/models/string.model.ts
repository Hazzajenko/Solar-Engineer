import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface StringModel {
  id: number
  project_id: number
  inverter_id: number
  tracker_id: number
  model?: UnitModel
  type?: TypeModel
  name: string
  is_in_parallel?: boolean
  panel_amount?: number
  created_at?: string
  version?: number
  color?: string
  totalVoc?: number
  totalVmp?: number
  totalPmax?: number
  totalIsc?: number
  totalImp?: number
}
