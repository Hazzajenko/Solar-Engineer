import { DesignStringModel } from '../types'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const StringsActions = createActionGroup({
  source: 'Strings Store',
  events: {
    'Init Strings': props<{
      projectId: number
    }>(),
    'Load Strings Success': props<{
      strings: DesignStringModel[]
    }>(),
    'Load Strings Failure': props<{
      error: string | null
    }>(),
    'Add String': props<{
      string: DesignStringModel
    }>(),
    'Create String With Panels': props<{
      string: DesignStringModel
      panelIds: string[]
    }>(),
    'Add String Without Signalr': props<{
      string: DesignStringModel
    }>(),
    'Add Many Strings': props<{
      strings: DesignStringModel[]
    }>(),
    'Update String': props<{
      update: UpdateStr<DesignStringModel>
    }>(),
    'Update String Without Signalr': props<{
      update: UpdateStr<DesignStringModel>
    }>(),
    // 'Update String': props<{ update: Update<StringModel> }>(),
    'Update Many Strings': props<{
      updates: UpdateStr<DesignStringModel>[]
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