import { PanelModel } from '../types'
import { PANELS_FEATURE_KEY, panelsAdapter, PanelsState } from './panels.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

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

export const selectPanelEntityById = (props: { id: string }) =>
  createSelector(selectPanelsEntities, (entities) => entities[props.id])

export const selectPanelById = (props: { id: string }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.find((panel) => panel.id === props.id),
  )

export const selectPanelsByIdArray = (props: { ids: string[] }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.filter((panel) => props.ids.includes(panel.id)),
  )