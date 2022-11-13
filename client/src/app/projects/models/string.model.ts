import { UnitModel } from './unit.model'

export interface StringModel {
  id: number
  project_id: number
  inverter_id: number
  tracker_id: number
  model?: UnitModel
  name: string
  is_in_parallel: boolean
  panel_amount?: number
  created_at?: string
  version: number
  color?: string
}
