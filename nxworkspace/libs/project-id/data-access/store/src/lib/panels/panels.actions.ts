import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '@shared/data-access/models'

export const PanelsActions = createActionGroup({
  source: 'Panels Store',
  events: {
    'Init Panels': props<{ projectId: number }>(),
    'Load Panels Success': props<{ panels: PanelModel[] }>(),
    'Load Panels Failure': props<{ error: string | null }>(),
    'Add Panel': props<{ panel: PanelModel }>(),
    'Add Many Panels': props<{ panels: PanelModel[] }>(),
    'Update Panel': props<{ update: Update<PanelModel> }>(),
    'Update Many Panels': props<{ updates: Update<PanelModel>[] }>(),
    'Delete Panel': props<{ id: string }>(),
    'Delete Many Panels': props<{ ids: string[] }>(),
    'Clear Panels State': emptyProps(),
  },
})
