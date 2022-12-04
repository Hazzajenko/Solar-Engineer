import { UnitModel } from './unit.model'

export class ChildBlockModel {
  child_block_id?: string
  child_block_model?: UnitModel
}

export class BlockModel {
  id: string
  location: string
  project_id?: number
  model: UnitModel
  inside_blocks?: ChildBlockModel[]

  constructor(
    id: string,
    location: string,
    model: UnitModel,
    inside_blocks?: ChildBlockModel[],
  ) {
    this.id = id
    this.location = location
    this.model = model
    this.inside_blocks = inside_blocks
  }
}
