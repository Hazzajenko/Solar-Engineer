import { TypeModel } from './type.model'

export class BlockModel {
  id: string
  location: string
  projectId?: number
  type: TypeModel

  constructor(id: string, location: string, type: TypeModel) {
    this.id = id
    this.location = location
    this.type = type
  }
}
