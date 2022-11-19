import { UnitModel } from './unit.model'
import { TypeModel } from './type.model'

export class JoinModel {
  id: string = 'err'
  project_id: number = 0
  color: string = 'purple'
  size: number = 4
  model: UnitModel = UnitModel.JOIN
  type: TypeModel = 'JOIN'
  
  // cable_blocks: string[] = []
  // block_ids: string[] = []
}
