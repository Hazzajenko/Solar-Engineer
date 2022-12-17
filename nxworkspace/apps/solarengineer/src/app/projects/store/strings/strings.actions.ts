import { createAction, props } from '@ngrx/store'
import { StringModel } from '../../../../../../../libs/shared/data-access/models/src/lib/string.model'
import { Update } from '@ngrx/entity'

export const addString = createAction(
  '[Strings Service] Add String',
  props<{ stringModel: StringModel }>(),
)

export const addStringsToTracker = createAction(
  '[Strings Service] Add Strings to Tracker',
  props<{ stringModels: StringModel[] }>(),
)

export const addStringsByProjectId = createAction(
  '[Strings Service] Add Strings By TrackerId',
  props<{ stringModels: StringModel[] }>(),
)

export const updateString = createAction(
  '[Strings Service] Update String',
  props<{ string: StringModel }>(),
)

export const selectString = createAction(
  '[Strings Service] Select String',
  props<{ string: StringModel }>(),
)

export const updateStringTotals = createAction(
  '[Strings Service] Update String Totals',
  props<{ strings: Update<StringModel>[] }>(),
)

export const deleteString = createAction(
  '[Strings Service] Delete String',
  props<{ stringId: number }>(),
)
