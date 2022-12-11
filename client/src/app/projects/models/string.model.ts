import { TypeModel } from './type.model'

export interface StringModel {
  id: string
  projectId?: number
  inverterId?: string
  trackerId?: string
  type?: TypeModel
  // type?: TypeModel
  name: string
  isInParallel?: boolean
  panelAmount?: number
  createdAt?: string
  version?: number
  color?: string
  totalVoc?: number
  totalVmp?: number
  totalPmax?: number
  totalIsc?: number
  totalImp?: number
}
