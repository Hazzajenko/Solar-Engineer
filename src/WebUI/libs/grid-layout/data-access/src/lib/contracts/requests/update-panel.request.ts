import { PanelModel, ProjectsSignalrRequest } from '@shared/data-access/models'
import { UpdateStr } from '@ngrx/entity/src/models'

export interface UpdatePanelRequest extends ProjectsSignalrRequest {
  signalrRequestId: string | undefined
  projectId: string
  update: UpdateStr<PanelModel>
}
