import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface StringModel {
  id: string
  projectId?: number
  inverterId?: string
  trackerId?: string
  model?: UnitModel
  type?: TypeModel
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
