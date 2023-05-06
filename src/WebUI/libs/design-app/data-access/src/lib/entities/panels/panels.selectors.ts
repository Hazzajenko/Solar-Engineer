import { PANELS_FEATURE_KEY, panelsAdapter, PanelsState } from './panels.reducer'
import { CanvasPanel } from '@design-app/shared'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectPanelsState = createFeatureSelector<PanelsState>(PANELS_FEATURE_KEY)

const { selectAll, selectEntities } = panelsAdapter.getSelectors()

export const selectAllPanels = createSelector(selectPanelsState, (state: PanelsState) =>
	selectAll(state),
)

export const selectPanelsEntities = createSelector(selectPanelsState, (state: PanelsState) =>
	selectEntities(state),
)

export const selectPanelById = (props: { id: string }) =>
	createSelector(selectPanelsEntities, (panels: Dictionary<CanvasPanel>) => panels[props.id])

/*export const selectPanelById = (props: { id: string }) =>
 createSelector(selectAllPanels, (panels: CanvasPanel[]) =>
 panels.find((panel) => panel.id === props.id),
 )*/

export const selectPanelsByStringId = (props: { stringId: string }) =>
	createSelector(selectAllPanels, (panels: CanvasPanel[]) =>
		panels.filter((panel) => panel.stringId === props.stringId),
	)

export const selectPanelsByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllPanels, (panels: CanvasPanel[]) =>
		panels.filter((panel) => props.ids.includes(panel.id)),
	)