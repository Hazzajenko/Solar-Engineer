import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'
import { getGuid } from '@ngrx/data'

export class PanelModel {
  id: string
  location: string
  name?: string
  projectId?: number
  inverterId?: string
  trackerId?: string
  stringId: string
  // has_child_block: boolean
  rotation: number
  model?: UnitModel
  child_block_id?: string
  child_block_model?: UnitModel

  join_id?: string
  selected?: boolean
  type?: TypeModel
  positiveToId?: string
  negativeToId?: string
  // location: string
  currentAtMaximumPower?: number
  shortCircuitCurrent?: number
  shortCircuitCurrentTemp?: number
  maximumPower?: number
  maximumPowerTemp?: number
  voltageAtMaximumPower?: number
  openCircuitVoltage?: number
  openCircuitVoltageTemp?: number
  length?: number
  weight?: number
  width?: number
  createdAt?: string
  color?: string
  version?: number

  constructor(location: string, stringId: string, rotation: number) {
    this.id = getGuid().toString()
    this.rotation = rotation
    // this.projectId = projectId

    this.location = location
    this.stringId = stringId
    this.name = 'Longi Himo555m'
    this.currentAtMaximumPower = 13.19
    this.shortCircuitCurrent = 14.01
    this.shortCircuitCurrentTemp = 0.05
    this.maximumPower = 555
    this.maximumPowerTemp = -0.34
    this.voltageAtMaximumPower = 42.1
    this.openCircuitVoltage = 49.95
    this.openCircuitVoltageTemp = -0.265
    this.length = 2256
    this.weight = 1133
    this.width = 27.2
  }
}
