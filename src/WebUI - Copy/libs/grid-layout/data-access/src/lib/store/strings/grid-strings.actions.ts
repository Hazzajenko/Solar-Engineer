import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GridStringModel } from '@shared/data-access/models'

export const GridStringsActions = createActionGroup({
  source: 'Strings Store',
  events: {
    'Init Strings': props<{
      projectId: number
    }>(),
    'Load Strings Success': props<{
      strings: GridStringModel[]
    }>(),
    'Load Strings Failure': props<{
      error: string | null
    }>(),
    'Add String': props<{
      string: GridStringModel
    }>(),
    'Create String With Panels': props<{
      string: GridStringModel
      panelIds: string[]
    }>(),
    'Add String Without Signalr': props<{
      string: GridStringModel
    }>(),
    'Add Many Strings': props<{
      strings: GridStringModel[]
    }>(),
    'Update String': props<{
      update: UpdateStr<GridStringModel>
    }>(),
    'Update String Without Signalr': props<{
      update: UpdateStr<GridStringModel>
    }>(),
    // 'Update String': props<{ update: Update<StringModel> }>(),
    'Update Many Strings': props<{
      updates: UpdateStr<GridStringModel>[]
    }>(),
    'Delete String': props<{
      stringId: string
    }>(),
    'Delete Many Strings': props<{
      ids: string[]
    }>(),
    'Clear Strings State': emptyProps(),
  },
})