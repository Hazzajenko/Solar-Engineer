import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface TrackerModel {
  id: string
  location?: string
  project_id: number
  inverter_id: string
  model?: UnitModel
  type?: TypeModel
  name: string
  max_input_current?: number
  max_short_circuit_current?: number
  string_amount?: number
  parallel_amount?: number
  panel_amount?: number
  // parallelLinks?: ParallelModel[];
  created_at?: string
  created_by: number
  version: number
}
