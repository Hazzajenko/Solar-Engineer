import { UnitModel } from './unit.model'

export class InsideBlockModel {
  inside_id?: string
  inside_model?: UnitModel
}

export class BlockModel {
  id: string
  location: string
  project_id?: number
  model: UnitModel
  inside_blocks?: InsideBlockModel[]

  constructor(
    id: string,
    location: string,
    model: UnitModel,
    inside_blocks?: InsideBlockModel[],
  ) {
    this.id = id
    this.location = location
    this.model = model
    this.inside_blocks = inside_blocks
  }
}
