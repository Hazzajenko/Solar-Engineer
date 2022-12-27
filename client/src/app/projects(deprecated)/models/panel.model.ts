import { TypeModel } from './type.model'

import { getGuid } from '@ngrx/data'
import { BlockModel } from './block.model'

export class PanelModel implements BlockModel {
  id: string
  projectId: number
  stringId: string
  location: string
  type: TypeModel
  rotation: number
  isDisconnectionPoint: boolean
  disconnectionPointPanelLinkId?: string
  positiveToId?: string
  negativeToId?: string
  name?: string
  inverterId?: string
  trackerId?: string
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

  constructor(projectId: number, location: string, stringId: string, rotation: number) {
    this.id = getGuid().toString()
    this.rotation = rotation
    this.projectId = projectId
    this.type = TypeModel.PANEL
    this.location = location
    this.stringId = stringId
    this.isDisconnectionPoint = false
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

  markAsDisconnectionPoint?() {
    this.isDisconnectionPoint = true
    return this
  }
}