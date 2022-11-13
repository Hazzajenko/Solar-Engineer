import { UnitModel } from './unit.model'

export interface PanelModel {
  id: number
  project_id?: number
  inverter_id?: number
  tracker_id?: number
  string_id: number
  model?: UnitModel
  name?: string
  location: string
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
  version: number
}
