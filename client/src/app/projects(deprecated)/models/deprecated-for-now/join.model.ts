import { TypeModel } from '../type.model'

export class JoinModel {
  id: string = 'err'
  project_id: number = 0
  color: string = 'purple'
  blocks?: string[] = []
  size: number = 4
  model: TypeModel = TypeModel.JOIN
  // type: TypeModel = 'JOIN'
}
