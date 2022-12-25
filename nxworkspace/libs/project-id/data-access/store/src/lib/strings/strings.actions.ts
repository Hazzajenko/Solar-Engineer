import { createActionGroup, props } from '@ngrx/store'
import { StringModel } from '@shared/data-access/models'

export const StringsActions = createActionGroup({
  source: 'Strings Store',
  events: {
    'Init Strings': props<{ projectId: number }>(),
    'Load Strings Success': props<{ strings: StringModel[] }>(),
    'Load Strings Failure': props<{ error: string | null }>(),
  },
})
