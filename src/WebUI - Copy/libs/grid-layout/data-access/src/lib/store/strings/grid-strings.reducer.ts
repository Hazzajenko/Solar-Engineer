import { GridStringsActions } from './grid-strings.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { GridStringModel } from '@shared/data-access/models'

export const STRINGS_FEATURE_KEY = 'grid-strings'

export interface GridStringsState extends EntityState<GridStringModel> {
  loaded: boolean
  // pathMap?: PanelPathMap
  error?: string | null
}

export const stringsAdapter: EntityAdapter<GridStringModel> = createEntityAdapter<GridStringModel>({
  selectId: (string) => string.id,
})

export const initialStringsState: GridStringsState = stringsAdapter.getInitialState({
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
  on(GridStringsActions.initStrings, (state) => ({ ...state, loaded: false, error: null })),
  on(GridStringsActions.loadStringsSuccess, (state, { strings }) =>
    stringsAdapter.setAll(strings, { ...state, loaded: true }),
  ),
  on(GridStringsActions.loadStringsFailure, (state, { error }) => ({ ...state, error })),
  on(GridStringsActions.addString, (state, { string }) => stringsAdapter.addOne(string, state)),
  on(GridStringsActions.addStringWithoutSignalr, (state, { string }) =>
    stringsAdapter.addOne(string, state),
  ),

  on(GridStringsActions.createStringWithPanels, (state, { string }) =>
    stringsAdapter.addOne(string, state),
  ),

  on(GridStringsActions.addManyStrings, (state, { strings }) =>
    stringsAdapter.addMany(strings, state),
  ),

  on(GridStringsActions.updateString, (state, { update }) =>
    stringsAdapter.updateOne(update, state),
  ),
  on(GridStringsActions.updateStringWithoutSignalr, (state, { update }) =>
    stringsAdapter.updateOne(update, state),
  ),

  on(GridStringsActions.deleteString, (state, { stringId }) =>
    stringsAdapter.removeOne(stringId, state),
  ),
)

export function gridStringsReducer(state: GridStringsState | undefined, action: Action) {
  return reducer(state, action)
}