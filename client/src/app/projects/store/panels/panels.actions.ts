import { createAction, props } from '@ngrx/store'
import { PanelModel } from '../../models/panel.model'
import { Update } from '@ngrx/entity'

export const addPanel = createAction('[Panels Service] Add Panel', props<{ panel: PanelModel }>())

export const addPanelsByProjectId = createAction(
  '[Panels Service] Add Panels',
  props<{ panels: PanelModel[] }>(),
)

export const updatePanel = createAction(
  '[Panels Service] Update Panel',
  props<{ panel: PanelModel }>(),
)

export const updateManyPanels = createAction(
  '[Panels Service] Update Many Panels',
  props<{ panels: Update<PanelModel>[] }>(),
)

export const deletePanel = createAction(
  '[Panels Service] Delete Panel',
  props<{ panel: PanelModel }>(),
)
