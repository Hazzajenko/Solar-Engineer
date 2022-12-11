import { TypeModel } from './type.model'

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
  cableId?: string
  location?: string
  disconnectionPointType?: DisconnectionPointType
  type: TypeModel = TypeModel.DISCONNECTIONPOINT
  color?: string
}
