import { Guid } from 'guid-typescript'
import { TypeModel } from './projects/index'

export enum DisconnectionPointType {
  UNDEFINED,
  MC4,
}

export class DisconnectionPointModel {
  id = ''
  projectId: number
  stringId: string
  positiveId: string
  negativeId: string
  location: string
  disconnectionPointType: DisconnectionPointType
  type: TypeModel
  color?: string

  constructor(
    projectId: number,
    stringId: string,
    location: string,
    positiveId: string,
    negativeId: string,
  ) {
    this.id = Guid.create().toString()
    this.projectId = projectId
    this.stringId = stringId
    this.location = location
    this.positiveId = positiveId
    this.negativeId = negativeId
    this.disconnectionPointType = DisconnectionPointType.MC4
    this.type = TypeModel.DISCONNECTIONPOINT
  }
}
