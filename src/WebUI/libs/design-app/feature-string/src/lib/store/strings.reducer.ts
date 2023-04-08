import { DesignStringModel } from '../types'
import { StringsActions } from './strings.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

export const DESIGN_STRINGS_FEATURE_KEY = 'designStrings'

export interface DesignStringsState extends EntityState<DesignStringModel> {
  loaded: boolean
  error?: string | null
}

export const designStringsAdapter: EntityAdapter<DesignStringModel> =
  createEntityAdapter<DesignStringModel>({
    selectId: (string) => string.id,
  })

export const initialDesignStringsState: DesignStringsState = designStringsAdapter.getInitialState({
  loaded: false,
  error: null,
})

const reducer = createReducer(
  initialDesignStringsState,
  on(StringsActions.initStrings, (state) => ({ ...state, loaded: false, error: null })),
  on(StringsActions.loadStringsSuccess, (state, { strings }) =>
    designStringsAdapter.setAll(strings, { ...state, loaded: true }),
  ),
  on(StringsActions.loadStringsFailure, (state, { error }) => ({ ...state, error })),
  on(StringsActions.addString, (state, { string }) => designStringsAdapter.addOne(string, state)),
  on(StringsActions.createStringWithPanels, (state, { string }) =>
    designStringsAdapter.addOne(string, state),
  ),
  on(StringsActions.addManyStrings, (state, { strings }) =>
    designStringsAdapter.addMany(strings, state),
  ),
  on(StringsActions.updateString, (state, { update }) =>
    designStringsAdapter.updateOne(update, state),
  ),
  on(StringsActions.deleteString, (state, { stringId }) =>
    designStringsAdapter.removeOne(stringId, state),
  ),
)

export function stringsReducer(state: DesignStringsState | undefined, action: Action) {
  return reducer(state, action)
}