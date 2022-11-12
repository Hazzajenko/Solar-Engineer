import { UnitModel } from './unit.model'

export interface StringModel {
  id: number
  projectId: number
  inverterId: number
  trackerId: number
  model?: UnitModel
  name: string
  isInParallel: boolean
  panelAmount?: number
  createdAt?: string
  version: number
}
