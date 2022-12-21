import { TypeModel } from './type.model'
import { getGuid } from '@ngrx/data'

export class StringModel {
  id: string
  projectId: number
  type: TypeModel
  name: string
  isInParallel: boolean
  color: string
  inverterId?: string
  trackerId?: string
  // type?: TypeModel
  panelAmount?: number
  createdAt?: string
  version?: number
  totalVoc?: number
  totalVmp?: number
  totalPmax?: number
  totalIsc?: number
  totalImp?: number

  constructor(projectId: number, name: string, color: string) {
    this.id = getGuid().toString()
    this.projectId = projectId
    this.name = name
    this.color = color
    this.isInParallel = false
    this.type = TypeModel.PANEL
  }

  makeParallel?() {
    this.isInParallel = true
    return this
  }
}
