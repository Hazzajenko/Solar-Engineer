import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '../../models/panel.model'
import { Update } from '@ngrx/entity'

/*export const addPanel = createAction(
  '[Panels Service] Add Panel',
  props<{ panel: PanelModel }>(),
)

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
  props<{ panelId: number }>(),
)*/

export interface CreatePanelRequest {
  project_id: number
  inverter_id: number
  tracker_id: number
  string_id: number
  location: string
}

export interface UpdatePanelRequest {
  project_id: number
  panel: PanelModel
  newLocation: string
}

export const PanelStateActions = createActionGroup({
  source: 'Panels Service',
  events: {
    'Add Panel Http': props<{ request: CreatePanelRequest }>(),
    'Add Panel To State': props<{ panel: PanelModel }>(),
    'Add Many Panels': props<{ panels: PanelModel[] }>(),
    'Update Panel Http': props<{ request: UpdatePanelRequest }>(),
    'Update Panel To State': props<{ panel: PanelModel }>(),
    'Update Many Panels': props<{ panels: Update<PanelModel>[] }>(),
    'Delete Panel': props<{ panelId: number }>(),
    'Clear Panels State': emptyProps(),
  },
})
