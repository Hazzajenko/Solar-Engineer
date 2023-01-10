import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { SelectedPanelLinkPathModel, PathModel, StringModel, TypeModel } from '@shared/data-access/models'

export const PathsActions = createActionGroup({
  source: 'Paths Store',
  events: {
    'Init Paths': props<{ pathId: string }>(),
    'Load Paths Success': props<{ paths: PathModel[] }>(),
    'Load Paths Failure': props<{ error: string | null }>(),
    'Add Path': props<{ path: PathModel }>(),
    'Add Many Paths': props<{ paths: PathModel[] }>(),
    'Update Path': props<{ update: Update<PathModel> }>(),
    'Update Many Paths': props<{ updates: Update<PathModel>[] }>(),
    'Delete Path': props<{ pathId: string }>(),
    'Delete Many Paths': props<{ pathIds: string[] }>(),
    'Set Selected Panel Link Paths': props<{ selectedPanelLinkPath: SelectedPanelLinkPathModel }>(),
    'Clear Selected Panel Link Paths': emptyProps(),
    'Clear Paths State': emptyProps(),
  },
})
