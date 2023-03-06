import { PanelModel } from '@shared/data-access/models'
import { UpdateStr } from '@ngrx/entity/src/models'

export interface UpdateManyPanelsRequest {
  projectId: string
  updates: UpdateStr<PanelModel>[]
}
