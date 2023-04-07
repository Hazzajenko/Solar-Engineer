import { FreePanelsActions } from './free-panels.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { FreePanelModel } from '@no-grid-layout/shared'

export const NO_GRID_FREE_PANELS_FEATURE_KEY = 'free_panels'

export interface FreePanelsState extends EntityState<FreePanelModel> {
  loaded: boolean
  error?: string | null
}

export interface FreePanelsPartialState {
  readonly [NO_GRID_FREE_PANELS_FEATURE_KEY]: FreePanelsState
}

export const freePanelsAdapter: EntityAdapter<FreePanelModel> = createEntityAdapter<FreePanelModel>(
  {
    selectId: (panel) => panel.id,
  },
)

export const initialFreePanelsState: FreePanelsState = freePanelsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialFreePanelsState,
  on(FreePanelsActions.initPanels, (state) => ({ ...state, loaded: false, error: null })),
  on(FreePanelsActions.loadPanelsSuccess, (state, { panels }) =>
    freePanelsAdapter.setAll(panels, { ...state, loaded: true }),
  ),
  on(FreePanelsActions.loadPanelsFailure, (state, { error }) => ({ ...state, error })),
  on(FreePanelsActions.addPanel, (state, { panel }) => freePanelsAdapter.addOne(panel, state)),
  on(FreePanelsActions.addManyPanels, (state, { panels }) =>
    freePanelsAdapter.addMany(panels, state),
  ),
  on(FreePanelsActions.updatePanel, (state, { update }) =>
    freePanelsAdapter.updateOne(update, state),
  ),
  on(FreePanelsActions.updateManyPanels, (state, { updates }) =>
    freePanelsAdapter.updateMany(updates, state),
  ),
  on(FreePanelsActions.deletePanel, (state, { panelId }) =>
    freePanelsAdapter.removeOne(panelId, state),
  ),
  on(FreePanelsActions.deleteManyPanels, (state, { panelIds }) =>
    freePanelsAdapter.removeMany(panelIds, state),
  ),
)

export function freePanelsReducer(state: FreePanelsState | undefined, action: Action) {
  return reducer(state, action)
}