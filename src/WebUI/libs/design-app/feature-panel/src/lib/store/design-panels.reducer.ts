import { DesignPanelModel } from '../types'
import { DesignPanelsActions } from './design-panels.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

export const DESIGN_PANELS_FEATURE_KEY = 'design-panels'

export interface DesignPanelsState extends EntityState<DesignPanelModel> {
  loaded: boolean
  error?: string | null
}

export interface DesignPanelsPartialState {
  readonly [DESIGN_PANELS_FEATURE_KEY]: DesignPanelsState
}

export const designPanelsAdapter: EntityAdapter<DesignPanelModel> =
  createEntityAdapter<DesignPanelModel>({
    selectId: (panel) => panel.id,
  })

export const initialDesignPanelsState: DesignPanelsState = designPanelsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialDesignPanelsState,
  on(DesignPanelsActions.initPanels, (state) => ({ ...state, loaded: false, error: null })),
  on(DesignPanelsActions.loadPanelsSuccess, (state, { panels }) =>
    designPanelsAdapter.setAll(panels, { ...state, loaded: true }),
  ),
  on(DesignPanelsActions.loadPanelsFailure, (state, { error }) => ({ ...state, error })),
  on(DesignPanelsActions.addPanel, (state, { panel }) => designPanelsAdapter.addOne(panel, state)),
  on(DesignPanelsActions.addManyPanels, (state, { panels }) =>
    designPanelsAdapter.addMany(panels, state),
  ),
  on(DesignPanelsActions.updatePanel, (state, { update }) =>
    designPanelsAdapter.updateOne(update, state),
  ),
  on(DesignPanelsActions.updateManyPanels, (state, { updates }) =>
    designPanelsAdapter.updateMany(updates, state),
  ),
  on(DesignPanelsActions.deletePanel, (state, { panelId }) =>
    designPanelsAdapter.removeOne(panelId, state),
  ),
  on(DesignPanelsActions.deleteManyPanels, (state, { panelIds }) =>
    designPanelsAdapter.removeMany(panelIds, state),
  ),
)

export function designPanelsReducer(state: DesignPanelsState | undefined, action: Action) {
  return reducer(state, action)
}