import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { StringModel } from '@shared/data-access/models'
import { ProjectItemUpdate } from '@shared/utils'

export const StringsActions = createActionGroup({
  source: 'Strings Store',
  events: {
    'Init Strings': props<{ projectId: number }>(),
    'Load Strings Success': props<{ strings: StringModel[] }>(),
    'Load Strings Failure': props<{ error: string | null }>(),
    'Add String': props<{ string: StringModel }>(),
    'Add Many Strings': props<{ strings: StringModel[] }>(),
    'Update String': props<{ update: ProjectItemUpdate<StringModel> }>(),
    // 'Update String': props<{ update: Update<StringModel> }>(),
    'Update Many Strings': props<{ updates: ProjectItemUpdate<StringModel>[] }>(),
    'Delete String': props<{ stringId: string }>(),
    'Delete Many Strings': props<{ ids: string[] }>(),
    'Clear Strings State': emptyProps(),
  },
})
