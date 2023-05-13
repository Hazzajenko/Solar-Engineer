/*
import { v4 as uuidv4 } from 'uuid'
import { BlockModel, BlockOptions, BlockType } from './block.model'

export interface PanelOptions extends BlockOptions {
  stringId: string
  rotation: number
}


export class PanelModel extends BlockModel {
  override type = BlockType.PANEL
  stringId: string
  // string?: StringModel
  rotation: number
  isDisconnectionPoint: boolean
  name: string
  currentAtMaximumPower: number
  shortCircuitCurrent: number
  shortCircuitCurrentTemp: number
  maximumPower: number
  maximumPowerTemp: number
  voltageAtMaximumPower: number
  openCircuitVoltage: number
  openCircuitVoltageTemp: number
  length: number
  weight: number
  width: number

  /!*  inverterId?: string
    trackerId?: string*!/

  constructor(options: PanelOptions) {
    super(options)
    this.id = uuidv4().toString()
    // this.string = string
    this.rotation = options.rotation
    this.projectId = options.projectId
    // this.type = BlockType.PANEL
    this.location = options.location
    this.stringId = options.stringId
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
*/
