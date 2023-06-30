import { PanelConfigsActions } from './panel-configs.actions'
import { PanelConfigModel } from '@entities/shared'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

export const PANEL_CONFIGS_FEATURE_KEY = 'panelConfigs'

export interface PanelConfigsState extends EntityState<PanelConfigModel> {
	loaded: boolean
	error?: string | null
}

export const panelConfigsAdapter: EntityAdapter<PanelConfigModel> =
	createEntityAdapter<PanelConfigModel>({
		selectId: (string) => string.id,
	})

export const initialPanelConfigsState: PanelConfigsState = panelConfigsAdapter.getInitialState({
	loaded: false,
	ids: ['Longi-Himo555m'],
	entities: {
		'Longi-Himo555m': {
			id: 'Longi-Himo555m',
			fullName: 'Longi Himo555m',
			brand: 'Longi',
			model: 'Himo555m',
			currentAtMaximumPower: 13.19,
			shortCircuitCurrent: 14.01,
			shortCircuitCurrentTemp: 0.05,
			maximumPower: 555,
			maximumPowerTemp: -0.34,
			voltageAtMaximumPower: 42.1,
			openCircuitVoltage: 49.95,
			openCircuitVoltageTemp: -0.265,
			length: 2256,
			width: 1133,
			weight: 27.2,
		},
	},
})

const reducer = createReducer(
	initialPanelConfigsState,
	on(PanelConfigsActions.loadLocalStoragePanelConfigs, (state, { panelConfigs }) =>
		panelConfigsAdapter.addMany(panelConfigs, state),
	),
	on(PanelConfigsActions.loadPanelConfigs, (state, { panelConfigs }) =>
		panelConfigsAdapter.setMany(panelConfigs, state),
	),
	on(PanelConfigsActions.addPanelConfig, (state, { panelConfig }) =>
		panelConfigsAdapter.addOne(panelConfig, state),
	),
	on(PanelConfigsActions.addManyPanelConfigs, (state, { panelConfigs }) =>
		panelConfigsAdapter.addMany(panelConfigs, state),
	),
	on(PanelConfigsActions.updatePanelConfig, (state, { update }) =>
		panelConfigsAdapter.updateOne(update, state),
	),
	on(PanelConfigsActions.updateManyPanelConfigs, (state, { updates }) =>
		panelConfigsAdapter.updateMany(updates, state),
	),
	on(PanelConfigsActions.deletePanelConfig, (state, { panelConfigId }) =>
		panelConfigsAdapter.removeOne(panelConfigId, state),
	),
	on(PanelConfigsActions.deleteManyPanelConfigs, (state, { panelConfigIds }) =>
		panelConfigsAdapter.removeMany(panelConfigIds, state),
	),
	on(PanelConfigsActions.addPanelConfigNoSignalr, (state, { panelConfig }) =>
		panelConfigsAdapter.addOne(panelConfig, state),
	),
	on(PanelConfigsActions.addManyPanelConfigsNoSignalr, (state, { panelConfigs }) =>
		panelConfigsAdapter.addMany(panelConfigs, state),
	),
	on(PanelConfigsActions.updatePanelConfigNoSignalr, (state, { update }) =>
		panelConfigsAdapter.updateOne(update, state),
	),
	on(PanelConfigsActions.updateManyPanelConfigsNoSignalr, (state, { updates }) =>
		panelConfigsAdapter.updateMany(updates, state),
	),
	on(PanelConfigsActions.deletePanelConfigNoSignalr, (state, { panelConfigId }) =>
		panelConfigsAdapter.removeOne(panelConfigId, state),
	),
	on(PanelConfigsActions.deleteManyPanelConfigsNoSignalr, (state, { panelConfigIds }) =>
		panelConfigsAdapter.removeMany(panelConfigIds, state),
	),
	on(PanelConfigsActions.clearPanelConfigsState, () => initialPanelConfigsState),
)

export function panelConfigsReducer(state: PanelConfigsState | undefined, action: Action) {
	return reducer(state, action)
}
