import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { PanelModel } from '@shared/data-access/models'
import { PanelsActions } from './panels.actions'

export const PANELS_FEATURE_KEY = 'panels'

export interface PanelsState extends EntityState<PanelModel> {
  loaded: boolean
  error?: string | null
}

export interface PanelsPartialState {
  readonly [PANELS_FEATURE_KEY]: PanelsState
}

export const panelsAdapter: EntityAdapter<PanelModel> = createEntityAdapter<PanelModel>()

export const initialPanelsState: PanelsState = panelsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialPanelsState,
  on(PanelsActions.initPanels, (state) => ({ ...state, loaded: false, error: null })),
  on(PanelsActions.loadPanelsSuccess, (state, { panels }) =>
    panelsAdapter.setAll(panels, { ...state, loaded: true }),
  ),
  on(PanelsActions.loadPanelsFailure, (state, { error }) => ({ ...state, error })),
  on(PanelsActions.addPanel, (state, { panel }) => panelsAdapter.addOne(panel, state)),
  on(PanelsActions.addManyPanels, (state, { panels }) => panelsAdapter.addMany(panels, state)),
  on(PanelsActions.updatePanel, (state, { update }) => panelsAdapter.updateOne(update, state)),
  on(PanelsActions.updateManyPanels, (state, { updates }) =>
    panelsAdapter.updateMany(updates, state),
  ),
  on(PanelsActions.deletePanel, (state, { panelId }) => panelsAdapter.removeOne(panelId, state)),
  on(PanelsActions.deleteManyPanels, (state, { panelIds }) =>
    panelsAdapter.removeMany(panelIds, state),
  ),
)

export function panelsReducer(state: PanelsState | undefined, action: Action) {
  return reducer(state, action)
}
