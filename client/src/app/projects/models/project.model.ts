import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export interface ProjectModel {
  id: number
  name: string
  model?: UnitModel
  type?: TypeModel
  createdBy: number
  createdAt: string
  inverterAmount: number
  trackerAmount: number
  parallelAmount: number
  stringAmount: number
  panelAmount: number
  projectMembersLength: number
}
