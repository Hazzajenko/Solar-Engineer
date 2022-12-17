import { TypeModel } from './type.model'

export interface ProjectModel {
  id: number
  name: string
  model?: TypeModel
  // type?: TypeModel
  createdBy: number
  createdAt: string
  inverterAmount: number
  trackerAmount: number
  parallelAmount: number
  stringAmount: number
  panelAmount: number
  projectMembersLength: number
}
