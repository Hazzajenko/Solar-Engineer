import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { StringModel } from '@shared/data-access/models'

import { StringsActions } from './strings.actions'

export const STRINGS_FEATURE_KEY = 'strings'

export interface StringsState extends EntityState<StringModel> {
  loaded: boolean
  error?: string | null
}

export interface ProjectsPartialState {
  readonly [STRINGS_FEATURE_KEY]: StringsState
}

export const stringsAdapter: EntityAdapter<StringModel> = createEntityAdapter<StringModel>()

export const initialStringsState: StringsState = stringsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialStringsState,
  on(StringsActions.initStrings, (state) => ({ ...state, loaded: false, error: null })),
  on(StringsActions.loadStringsSuccess, (state, { strings }) =>
    stringsAdapter.setAll(strings, { ...state, loaded: true }),
  ),
  on(StringsActions.loadStringsFailure, (state, { error }) => ({ ...state, error })),
)

export function stringsReducer(state: StringsState | undefined, action: Action) {
  return reducer(state, action)
}
