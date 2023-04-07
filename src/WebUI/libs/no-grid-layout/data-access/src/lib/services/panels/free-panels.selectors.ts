import {
  freePanelsAdapter,
  FreePanelsState,
  NO_GRID_FREE_PANELS_FEATURE_KEY,
} from './free-panels.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { FreePanelModel } from '@no-grid-layout/shared'

export const selectFreePanelsState = createFeatureSelector<FreePanelsState>(
  NO_GRID_FREE_PANELS_FEATURE_KEY,
)

const { selectAll, selectEntities } = freePanelsAdapter.getSelectors()

export const selectFreePanelsLoaded = createSelector(
  selectFreePanelsState,
  (state: FreePanelsState) => state.loaded,
)

export const selectFreePanelsError = createSelector(
  selectFreePanelsState,
  (state: FreePanelsState) => state.error,
)

export const selectAllFreePanels = createSelector(selectFreePanelsState, (state: FreePanelsState) =>
  selectAll(state),
)

export const selectFreePanelsEntities = createSelector(
  selectFreePanelsState,
  (state: FreePanelsState) => selectEntities(state),
)

export const selectFreePanelEntityById = (props: { id: string }) =>
  createSelector(selectFreePanelsEntities, (entities) => entities[props.id])

/*export const selectPanelsByRouteParams = createSelector(
 selectAllPanels,
 RouterSelectors.selectRouteParams,
 (panels, { projectId }) => panels.filter((p) => p.projectId === projectId /!*Number(projectId)*!/),
 )*/

export const selectFreePanelById = (props: { id: string }) =>
  createSelector(
    selectAllFreePanels,
    (panels: FreePanelModel[]) => panels.find((panel) => panel.id === props.id),
    // panels.find((panel) => panel.id === props.id),
  )

/*export const selectStringIdByPanelId = (props: { panelId: string }) =>
 createSelector(
 selectAllPanels,
 (panels: FreePanelModel[]) => panels.find((panel) => panel.id === props.panelId)?.stringId,
 )*/

/*export const selectPanelsByStringId = (props: { stringId: string }) =>
 createSelector(selectAllPanels, (panels: FreePanelModel[]) =>
 panels.filter((panel) => panel.stringId === props.stringId),
 )*/

/*   this.isSelectedPanel$ = this.store
 .select(selectSelectedPanelId)
 .pipe(map((selectedPanelId) => selectedPanelId === this.id))
 this.isSelectedPositiveTo$ = this.store
 .select(selectSelectedPositiveTo)
 .pipe(map((positiveTo) => positiveTo === this.id))
 this.isSelectedNegativeTo$ = this.store
 .select(selectSelectedNegativeTo)
 .pipe(map((negativeTo) => negativeTo === this.id))
 this.isSelectedString$ = this.store
 .select(selectSelectedStringId)
 .pipe(combineLatestWith(this.panel$))
 .pipe(map(([selectedStringId, panel]) => selectedStringId === panel?.stringId))
 this.isPanelToJoin$ = this.store
 .select(selectPanelToLink)
 .pipe(map((panelToLink) => panelToLink?.id === this.id)) */