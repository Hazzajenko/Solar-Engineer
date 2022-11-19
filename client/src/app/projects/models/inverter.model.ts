import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface InverterModel {
  id: string
  location?: string
  color?: string
  project_id?: number
  model?: UnitModel
  type?: TypeModel
  name: string
  created_by?: number
  created_at?: string
  ac_nominal_output?: number
  ac_output_current?: number
  european_efficiency?: number
  max_input_current?: number
  max_output_power?: number
  mpp_voltage_range_low?: number
  mpp_voltage_range_high?: number
  start_up_voltage?: number
}
