import { TypeModel } from './type.model'

export class BlockModel {
  id: string
  projectId: number
  location: string
  type: TypeModel

  constructor(id: string, projectId: number, location: string, type: TypeModel) {
    this.id = id
    this.projectId = projectId
    this.location = location
    this.type = type
  }
}
