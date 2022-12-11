import { TypeModel } from '../type.model'

export interface InverterModel {
  id: string
  location?: string
  color?: string
  projectId?: number
  model?: TypeModel
  // type?: TypeModel
  name: string
  createdBy?: number
  createdAt?: string
  acNominalOutput?: number
  acOutputCurrent?: number
  europeanEfficiency?: number
  maxInputCurrent?: number
  maxOutputPower?: number
  mppVoltageRangeLow?: number
  mppVoltageRangeHigh?: number
  startUpVoltage?: number
}
