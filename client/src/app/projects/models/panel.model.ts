import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'
import { getGuid } from '@ngrx/data'

export class PanelModel {
  id: string
  location: string
  string_id: string
  has_child_block: boolean
  model?: UnitModel
  child_block_id?: string
  child_block_model?: UnitModel
  project_id?: number
  inverter_id?: string
  tracker_id?: string
  join_id?: string
  selected?: boolean
  type?: TypeModel
  name?: string
  positive_to?: string
  negative_to?: string
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

  constructor(
    projectId: number,
    location: string,
    stringId: string,
    hasChildBlock: boolean,
    childBlockId?: string,
    childBlockModel?: UnitModel,
  ) {
    this.id = getGuid().toString()
    this.project_id = projectId
    this.location = location
    this.string_id = stringId
    this.has_child_block = hasChildBlock
    this.child_block_id = childBlockId
    this.child_block_model = childBlockModel
  }
}
