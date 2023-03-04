import { PanelModel } from '@shared/data-access/models'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { RouterSelectors } from '@shared/data-access/router'
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
  RouterSelectors.selectRouteParams,
  (panels, { projectId }) => panels.filter((p) => p.projectId === projectId /*Number(projectId)*/),
)

export const selectPanelById = (props: { id: string }) =>
  createSelector(
    selectAllPanels,
    (panels: PanelModel[]) => panels.find((panel) => panel.id === props.id),
    // panels.find((panel) => panel.id === props.id),
  )

export const selectStringIdByPanelId = (props: { panelId: string }) =>
  createSelector(
    selectAllPanels,
    (panels: PanelModel[]) => panels.find((panel) => panel.id === props.panelId)?.stringId,
  )

export const selectPanelsByStringId = (props: { stringId: string }) =>
  createSelector(selectAllPanels, (panels: PanelModel[]) =>
    panels.filter((panel) => panel.stringId === props.stringId),
  )

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
