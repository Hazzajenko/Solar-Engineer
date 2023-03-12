import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '@shared/data-access/models'
import { UpdateStr } from '@ngrx/entity/src/models'

export const PanelsActions = createActionGroup({
  source: 'Panels Store',
  events: {
    'Init Panels': props<{ projectId: number }>(),
    'Load Panels Success': props<{ panels: PanelModel[] }>(),
    'Load Panels Failure': props<{ error: string | null }>(),
    'Add Panel': props<{ panel: PanelModel }>(),
    'Add Panel Without Signalr': props<{ panel: PanelModel }>(),
    'Add Many Panels': props<{ panels: PanelModel[] }>(),
    'Add Many Panels Without Signalr': props<{ panels: PanelModel[] }>(),
    'Update Panel': props<{ update: UpdateStr<PanelModel> }>(),
    'Update Panel Without Signalr': props<{ update: UpdateStr<PanelModel> }>(),
    'Update Many Panels': props<{ updates: UpdateStr<PanelModel>[] }>(),
    'Update Many Panels Without Signalr': props<{ updates: UpdateStr<PanelModel>[] }>(),
    'Delete Panel': props<{ panelId: string }>(),
    'Delete Panel Without Signalr': props<{ panelId: string }>(),
    'Delete Many Panels': props<{ panelIds: string[] }>(),
    'Delete Many Panels Without Signalr': props<{ panelIds: string[] }>(),
    'Clear Panels State': emptyProps(),
  },
})
