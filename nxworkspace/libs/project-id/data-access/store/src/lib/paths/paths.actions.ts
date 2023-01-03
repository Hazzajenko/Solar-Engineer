import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelLinkPathModel, StringModel, TypeModel } from '@shared/data-access/models'

export const PathsActions = createActionGroup({
  source: 'Paths Store',
  events: {
    'Init Paths': props<{ pathId: string }>(),
    'Load Paths Success': props<{ paths: PanelLinkPathModel[] }>(),
    'Load Paths Failure': props<{ error: string | null }>(),
    'Add Path': props<{ path: PanelLinkPathModel }>(),
    'Add Many Paths': props<{ paths: PanelLinkPathModel[] }>(),
    'Update Path': props<{ update: Update<PanelLinkPathModel> }>(),
    'Update Many Paths': props<{ updates: Update<PanelLinkPathModel>[] }>(),
    'Delete Path': props<{ pathId: string }>(),
    'Delete Many Paths': props<{ pathIds: string[] }>(),
    'Clear Paths State': emptyProps(),
  },
})
