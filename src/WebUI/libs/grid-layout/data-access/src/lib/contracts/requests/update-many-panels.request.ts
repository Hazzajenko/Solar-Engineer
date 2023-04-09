import { UpdateStr } from '@ngrx/entity/src/models'
import { GridPanelModel } from '@shared/data-access/models'

export interface UpdateManyPanelsRequest {
  projectId: string
  updates: UpdateStr<GridPanelModel>[]
}