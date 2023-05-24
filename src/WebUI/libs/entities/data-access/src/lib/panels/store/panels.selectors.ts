import { PANELS_FEATURE_KEY, panelsAdapter, PanelsState } from './panels.reducer'
import { PanelModel } from '@entities/shared'
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
	createSelector(selectPanelsEntities, (panels: Dictionary<PanelModel>) => panels[props.id])

export const selectPanelsByStringId = (props: { stringId: string }) =>
	createSelector(selectAllPanels, (panels: PanelModel[]) =>
		panels.filter((panel) => panel.stringId === props.stringId),
	)

export const selectPanelsByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllPanels, (panels: PanelModel[]) =>
		panels.filter((panel) => props.ids.includes(panel.id)),
	)
