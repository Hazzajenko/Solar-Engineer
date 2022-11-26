import { UnitModel } from './unit.model'

export enum DisconnectionPointType {
  UNDEFINED,
  MC4,
}

export class DisconnectionPointModel {
  id: string = ''
  project_id?: number
  string_id?: string
  positive_id?: string
  negative_id?: string
  location?: string
  disconnection_type?: DisconnectionPointType
  model: UnitModel = UnitModel.DISCONNECTIONPOINT
  color?: string
}
