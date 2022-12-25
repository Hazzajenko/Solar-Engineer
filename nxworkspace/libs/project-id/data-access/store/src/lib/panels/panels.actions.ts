import { createActionGroup, props } from '@ngrx/store'
import { PanelModel } from '@shared/data-access/models'

export const PanelsActions = createActionGroup({
  source: 'Panels Store',
  events: {
    'Init Panels': props<{ projectId: number }>(),
    'Load Panels Success': props<{ panels: PanelModel[] }>(),
    'Load Panels Failure': props<{ error: string | null }>(),
  },
})
