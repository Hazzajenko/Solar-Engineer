import { FreePanelModel } from '../free-panel.model'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createAction, props } from '@ngrx/store'

export const initFreePanels = createAction('[FreePanels Page] Init')

export const addFreePanel = createAction(
  '[FreePanels Page] Add Free Panel',
  props<{ freePanel: FreePanelModel }>(),
)

export const updateFreePanel = createAction(
  '[FreePanels Page] Update Free Panel',
  props<{ update: UpdateStr<FreePanelModel> }>(),
)
export const loadFreePanelsSuccess = createAction(
  '[FreePanels/API] Load FreePanels Success',
  props<{ freePanels: FreePanelModel[] }>(),
)

export const loadFreePanelsFailure = createAction(
  '[FreePanels/API] Load FreePanels Failure',
  props<{ error: any }>(),
)