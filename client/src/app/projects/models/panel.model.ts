import { UnitModel } from './unit.model'

export interface PanelModel {
  id: number
  projectId?: number
  inverterId?: number
  trackerId?: number
  stringId: number
  model?: UnitModel
  name?: string
  location: string
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
  version: number
}
