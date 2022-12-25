import { PanelModel } from '@shared/data-access/models'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectRouteParams } from '@shared/data-access/router'
import { PANELS_FEATURE_KEY, panelsAdapter, PanelsState } from './panels.reducer'

export const selectPanelsState = createFeatureSelector<PanelsState>(PANELS_FEATURE_KEY)

const { selectAll, selectEntities } = panelsAdapter.getSelectors()

export const selectPanelsLoaded = createSelector(
  selectPanelsState,
  (state: PanelsState) => state.loaded,
)

export const selectPanelsError = createSelector(
  selectPanelsState,
  (state: PanelsState) => state.error,
)

export const selectAllPanels = createSelector(selectPanelsState, (state: PanelsState) =>
  selectAll(state),
)

export const selectPanelsEntities = createSelector(selectPanelsState, (state: PanelsState) =>
  selectEntities(state),
)

export const selectPanelsByRouteParams = createSelector(
  selectAllPanels,
  selectRouteParams,
  (panels, { projectId }) => panels.filter((p) => p.projectId === Number(projectId)),
)

export const selectPanelById = (props: { id: string }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.find((panel) => panel.id === props.id),
  )

export const selectPanelsByStringId = (props: { stringId: string }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.filter((panel) => panel.stringId === props.stringId),
  )
