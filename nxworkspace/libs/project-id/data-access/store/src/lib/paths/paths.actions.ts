import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { SelectedPanelLinkPathModel, StringLinkPathModel, StringModel, TypeModel } from '@shared/data-access/models'

export const PathsActions = createActionGroup({
  source: 'Paths Store',
  events: {
    'Init Paths': props<{ pathId: string }>(),
    'Load Paths Success': props<{ paths: StringLinkPathModel[] }>(),
    'Load Paths Failure': props<{ error: string | null }>(),
    'Add Path': props<{ path: StringLinkPathModel }>(),
    'Add Many Paths': props<{ paths: StringLinkPathModel[] }>(),
    'Update Path': props<{ update: Update<StringLinkPathModel> }>(),
    'Update Many Paths': props<{ updates: Update<StringLinkPathModel>[] }>(),
    'Delete Path': props<{ pathId: string }>(),
    'Delete Many Paths': props<{ pathIds: string[] }>(),
    'Set Selected Panel Link Paths': props<{ selectedPanelLinkPath: SelectedPanelLinkPathModel }>(),
    'Clear Selected Panel Link Paths': emptyProps(),
    'Clear Paths State': emptyProps(),
  },
})
