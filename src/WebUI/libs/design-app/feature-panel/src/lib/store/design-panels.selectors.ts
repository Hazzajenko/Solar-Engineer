import { DesignPanelModel } from '../types'
import {
  DESIGN_PANELS_FEATURE_KEY,
  designPanelsAdapter,
  DesignPanelsState,
} from './design-panels.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectDesignPanelsState =
  createFeatureSelector<DesignPanelsState>(DESIGN_PANELS_FEATURE_KEY)

const { selectAll, selectEntities } = designPanelsAdapter.getSelectors()

export const selectDesignPanelsLoaded = createSelector(
  selectDesignPanelsState,
  (state: DesignPanelsState) => state.loaded,
)

export const selectDesignPanelsError = createSelector(
  selectDesignPanelsState,
  (state: DesignPanelsState) => state.error,
)

export const selectAllDesignPanels = createSelector(
  selectDesignPanelsState,
  (state: DesignPanelsState) => selectAll(state),
)

export const selectDesignPanelsEntities = createSelector(
  selectDesignPanelsState,
  (state: DesignPanelsState) => selectEntities(state),
)

export const selectDesignPanelEntityById = (props: { id: string }) =>
  createSelector(selectDesignPanelsEntities, (entities) => entities[props.id])

export const selectDesignPanelById = (props: { id: string }) =>
  createSelector(selectAllDesignPanels, (panels: DesignPanelModel[]) =>
    panels.find((panel) => panel.id === props.id),
  )

export const selectDesignPanelsByIdArray = (props: { ids: string[] }) =>
  createSelector(selectAllDesignPanels, (panels: DesignPanelModel[]) =>
    panels.filter((panel) => props.ids.includes(panel.id)),
  )