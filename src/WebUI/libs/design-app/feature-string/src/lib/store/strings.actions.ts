import { StringModel } from '../types'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const StringsActions = createActionGroup({
  source: 'Strings Store',
  events: {
    'Init Strings': props<{
      projectId: number
    }>(),
    'Load Strings Success': props<{
      strings: StringModel[]
    }>(),
    'Load Strings Failure': props<{
      error: string | null
    }>(),
    'Add String': props<{
      string: StringModel
    }>(),
    'Create String With Panels': props<{
      string: StringModel
      panelIds: string[]
    }>(),
    'Add String Without Signalr': props<{
      string: StringModel
    }>(),
    'Add Many Strings': props<{
      strings: StringModel[]
    }>(),
    'Update String': props<{
      update: UpdateStr<StringModel>
    }>(),
    'Update String Without Signalr': props<{
      update: UpdateStr<StringModel>
    }>(),
    // 'Update String': props<{ update: Update<StringModel> }>(),
    'Update Many Strings': props<{
      updates: UpdateStr<StringModel>[]
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