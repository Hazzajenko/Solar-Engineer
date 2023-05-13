import { UpdateStr } from '@ngrx/entity/src/models'
import { GridPanelModel, ProjectsSignalrRequest } from '@shared/data-access/models'

export interface UpdatePanelRequest extends ProjectsSignalrRequest {
  requestId: string
  projectId: string
  update: UpdateStr<GridPanelModel>
}