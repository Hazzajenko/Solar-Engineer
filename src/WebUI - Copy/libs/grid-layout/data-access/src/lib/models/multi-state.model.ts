import { TypeModel } from '@shared/data-access/models'

export interface MultiStateModel {
  multiMode: boolean
  type?: TypeModel
  locationStart?: string
  locationFinish?: string
}
