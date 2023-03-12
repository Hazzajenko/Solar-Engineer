import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { StringModel } from '@shared/data-access/models'

import { StringsActions } from './strings.actions'

export const STRINGS_FEATURE_KEY = 'strings'

export interface StringsState extends EntityState<StringModel> {
  loaded: boolean
  // pathMap?: PanelPathMap
  error?: string | null
}

export const stringsAdapter: EntityAdapter<StringModel> = createEntityAdapter<StringModel>({
  selectId: (string) => string.id,
})

export const initialStringsState: StringsState = stringsAdapter.getInitialState({
  loaded: false,
  error: null,
})

/*const hi: EntityMap<StringModel> = entity => entity.linkPathMap
const h2i: EntityMapOne<StringModel> = {
  id: '11',
  map: new EntityMap<StringModel>
}*/

const reducer = createReducer(
  initialStringsState,
  on(StringsActions.initStrings, (state) => ({ ...state, loaded: false, error: null })),
  on(StringsActions.loadStringsSuccess, (state, { strings }) =>
    stringsAdapter.setAll(strings, { ...state, loaded: true }),
  ),
  on(StringsActions.loadStringsFailure, (state, { error }) => ({ ...state, error })),
  on(StringsActions.addString, (state, { string }) => stringsAdapter.addOne(string, state)),
  on(StringsActions.addStringWithoutSignalr, (state, { string }) =>
    stringsAdapter.addOne(string, state),
  ),

  on(StringsActions.createStringWithPanels, (state, { string }) =>
    stringsAdapter.addOne(string, state),
  ),

  on(StringsActions.addManyStrings, (state, { strings }) => stringsAdapter.addMany(strings, state)),

  on(StringsActions.updateString, (state, { update }) => stringsAdapter.updateOne(update, state)),
  on(StringsActions.updateStringWithoutSignalr, (state, { update }) =>
    stringsAdapter.updateOne(update, state),
  ),

  on(StringsActions.deleteString, (state, { stringId }) =>
    stringsAdapter.removeOne(stringId, state),
  ),
)

export function stringsReducer(state: StringsState | undefined, action: Action) {
  return reducer(state, action)
}
