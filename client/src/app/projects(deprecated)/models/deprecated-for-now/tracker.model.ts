import { TypeModel } from '../type.model'

export interface TrackerModel {
  id: string
  location?: string
  projectId: number
  inverterId: string
  model?: TypeModel
  // type?: TypeModel
  name: string
  maxInputCurrent?: number
  maxShortCircuitCurrent?: number
  stringAmount?: number
  parallelAmount?: number
  panelAmount?: number
  // parallelLinks?: ParallelModel[];
  createdAt?: string
  createdBy: number
  version: number
}
