import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface PanelModel {
  id: string
  project_id?: number
  inverter_id?: string
  tracker_id?: string
  join_id?: string
  selected?: boolean
  string_id: string
  model?: UnitModel
  type?: TypeModel
  name?: string
  positive_to?: string
  negative_to?: string
  location: string
  // location: string
  current_at_maximum_power?: number
  short_circuit_current?: number
  short_circuit_current_temp?: number
  maximum_power?: number
  maximum_power_temp?: number
  voltage_at_maximum_power?: number
  open_circuit_voltage?: number
  open_circuit_voltage_temp?: number
  length?: number
  weight?: number
  width?: number
  created_at?: string
  color?: string
  version?: number
}
