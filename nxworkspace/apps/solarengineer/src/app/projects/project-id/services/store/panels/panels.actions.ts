import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel.model'
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
  location: number
}

export interface UpdatePanelRequest {
  project_id: number
  panel: PanelModel
  newLocation: number
}

export const PanelStateActions = createActionGroup({
  source: 'Panels State',
  events: {
    'Add Panel': props<{ panel: PanelModel }>(),
    'Add Panel Http': emptyProps(),
    'Add Many Panels': props<{ panels: PanelModel[] }>(),
    'Add Many Panels Http': emptyProps(),
    'Update Panel': props<{ panel: Partial<PanelModel> }>(),
    'Update Panel Http': emptyProps(),
    'Update Many Panels': props<{ panels: Update<PanelModel>[] }>(),
    'Update Many Panels Http': emptyProps(),
    'Delete Panel': props<{ panelId: string }>(),
    'Delete Panel Http': emptyProps(),
    'Delete Many Panels': props<{ panelIds: string[] }>(),
    'Delete Many Panels Http': emptyProps(),
    'Clear Panels State': emptyProps(),
  },
})
