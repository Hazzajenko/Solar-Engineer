import { UnitModel } from './unit.model'

export enum DisconnectionPointType {
  UNDEFINED,
  MC4,
}

export class DisconnectionPointModel {
  id: string = ''
  projectId?: number
  stringId?: string
  positiveId?: string
  negativeId?: string
  cable_id?: string
  location?: string
  disconnectionPointType?: DisconnectionPointType
  model: UnitModel = UnitModel.DISCONNECTIONPOINT
  color?: string
}
