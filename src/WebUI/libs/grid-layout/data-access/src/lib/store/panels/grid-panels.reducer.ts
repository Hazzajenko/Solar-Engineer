import { GridPanelsActions } from './grid-panels.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { GridPanelModel } from '@shared/data-access/models'

export const GRID_PANELS_FEATURE_KEY = 'grid-panels'

export interface GridPanelsState extends EntityState<GridPanelModel> {
  loaded: boolean
  error?: string | null
}

export interface PanelsPartialState {
  readonly [GRID_PANELS_FEATURE_KEY]: GridPanelsState
}

export const panelsAdapter: EntityAdapter<GridPanelModel> = createEntityAdapter<GridPanelModel>()

export const initialPanelsState: GridPanelsState = panelsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialPanelsState,
  on(GridPanelsActions.initPanels, (state) => ({ ...state, loaded: false, error: null })),
  on(GridPanelsActions.loadPanelsSuccess, (state, { panels }) =>
    panelsAdapter.setAll(panels, { ...state, loaded: true }),
  ),
  on(GridPanelsActions.loadPanelsFailure, (state, { error }) => ({ ...state, error })),
  on(GridPanelsActions.addPanel, (state, { panel }) => panelsAdapter.addOne(panel, state)),
  on(GridPanelsActions.addPanelWithoutSignalr, (state, { panel }) =>
    panelsAdapter.addOne(panel, state),
  ),
  on(GridPanelsActions.addManyPanels, (state, { panels }) => panelsAdapter.addMany(panels, state)),
  on(GridPanelsActions.updatePanel, (state, { update }) => panelsAdapter.updateOne(update, state)),
  on(GridPanelsActions.updatePanelWithoutSignalr, (state, { update }) =>
    panelsAdapter.updateOne(update, state),
  ),
  on(GridPanelsActions.updateManyPanels, (state, { updates }) =>
    panelsAdapter.updateMany(updates, state),
  ),
  on(GridPanelsActions.updateManyPanelsWithoutSignalr, (state, { updates }) =>
    panelsAdapter.updateMany(updates, state),
  ),
  on(GridPanelsActions.deletePanel, (state, { panelId }) =>
    panelsAdapter.removeOne(panelId, state),
  ),
  on(GridPanelsActions.deleteManyPanels, (state, { panelIds }) =>
    panelsAdapter.removeMany(panelIds, state),
  ),
)

export function gridPanelsReducer(state: GridPanelsState | undefined, action: Action) {
  return reducer(state, action)
}