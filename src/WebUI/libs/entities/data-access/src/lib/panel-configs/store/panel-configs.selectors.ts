import {
	PANEL_CONFIGS_FEATURE_KEY,
	panelConfigsAdapter,
	PanelConfigsState,
} from './panel-configs.reducer'
import { PanelConfigModel } from '@entities/shared'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectPanelConfigsState =
	createFeatureSelector<PanelConfigsState>(PANEL_CONFIGS_FEATURE_KEY)

const { selectAll, selectEntities } = panelConfigsAdapter.getSelectors()

export const selectAllPanelConfigs = createSelector(
	selectPanelConfigsState,
	(state: PanelConfigsState) => selectAll(state),
)

export const selectPanelConfigsEntities = createSelector(
	selectPanelConfigsState,
	(state: PanelConfigsState) => selectEntities(state),
)

export const selectPanelConfigById = (props: { id: string }) =>
	createSelector(
		selectPanelConfigsEntities,
		(panelConfigs: Dictionary<PanelConfigModel>) => panelConfigs[props.id],
	)

export const selectPanelConfigsByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllPanelConfigs, (panelConfigs: PanelConfigModel[]) =>
		panelConfigs.filter((panel) => props.ids.includes(panel.id)),
	)

export const selectSelectedPanelConfigId = createSelector(
	selectPanelConfigsState,
	(state: PanelConfigsState) => state.selectedPanelConfigId,
)
