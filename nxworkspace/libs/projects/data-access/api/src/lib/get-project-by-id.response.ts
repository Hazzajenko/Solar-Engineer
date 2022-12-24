import { BlockModel, EntityModel, ProjectModel } from '@shared/data-access/models'

export interface GetProjectByIdResponse {
  project: ProjectModel
  entities: EntityModel[]
  blocks: BlockModel[]
}
