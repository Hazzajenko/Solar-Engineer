import { FreePanelModel } from '../free-panel.model'
import * as FreePanelsActions from './free-panels.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

export const FREE_PANELS_FEATURE_KEY = 'freePanels'

export interface FreePanelsState extends EntityState<FreePanelModel> {
  selectedId?: string | number // which FreePanels record has been selected
  loaded: boolean // has the FreePanels list been loaded
  error?: string | null // last known error (if any)
}

export interface FreePanelsPartialState {
  readonly [FREE_PANELS_FEATURE_KEY]: FreePanelsState
}

export const freePanelsAdapter: EntityAdapter<FreePanelModel> =
  createEntityAdapter<FreePanelModel>()

export const initialFreePanelsState: FreePanelsState = freePanelsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
})

const reducer = createReducer(
  initialFreePanelsState,
  on(FreePanelsActions.initFreePanels, (state) => ({ ...state, loaded: false, error: null })),
  on(FreePanelsActions.loadFreePanelsSuccess, (state, { freePanels }) =>
    freePanelsAdapter.setAll(freePanels, { ...state, loaded: true }),
  ),
  on(FreePanelsActions.loadFreePanelsFailure, (state, { error }) => ({ ...state, error })),
  on(FreePanelsActions.addFreePanel, (state, { freePanel }) =>
    freePanelsAdapter.addOne(freePanel, state),
  ),
  on(FreePanelsActions.updateFreePanel, (state, { update }) =>
    freePanelsAdapter.updateOne(update, state),
  ),
)

export function freePanelsReducer(state: FreePanelsState | undefined, action: Action) {
  return reducer(state, action)
}