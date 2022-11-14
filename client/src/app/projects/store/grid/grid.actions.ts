import { createAction, props } from '@ngrx/store'
import { StringModel } from '../../models/string.model'

export const selectStringForGrid = createAction(
  '[Grid Service] Select String For Grid',
  props<{ string: StringModel }>(),
)

export const selectTrackerStringsForGrid = createAction(
  '[Grid Service] Select Tracker Strings For Grid',
  props<{ strings: StringModel[] }>(),
)

export const selectInverterStringsForGrid = createAction(
  '[Grid Service] Select Inverter Strings For Grid',
  props<{ strings: StringModel[] }>(),
)

export const clearGridState = createAction('[Grid Service] Clear Grid State')
