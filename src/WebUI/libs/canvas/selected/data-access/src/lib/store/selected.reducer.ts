import { SelectedActions } from './selected.actions'
import { Action, createReducer, on } from '@ngrx/store'
import { PanelId, PanelLinkId, StringId } from '@entities/shared'
import { CompleteEntityBounds } from '@shared/data-access/models'

export const SELECTED_FEATURE_KEY = 'selected'

export const ENTITY_SELECTED_STATE = {
	SINGLE_ENTITY_SELECTED: 'SingleEntitySelected',
	MULTIPLE_ENTITIES_SELECTED: 'MultipleEntitiesSelected',
	NONE_SELECTED: 'NoneSelected',
} as const

export type EntitySelectedState = (typeof ENTITY_SELECTED_STATE)[keyof typeof ENTITY_SELECTED_STATE]

export interface SelectedState {
	singleSelectedPanelId: PanelId | undefined
	multipleSelectedPanelIds: PanelId[]
	selectedStringId: StringId | undefined
	selectedPanelLinkId: PanelLinkId | undefined
	entityState: EntitySelectedState
	selectedPanelsBoxBounds: CompleteEntityBounds | undefined
	selectedStringBoxBounds: CompleteEntityBounds | undefined
}

export const initialSelectedState: SelectedState = {
	singleSelectedPanelId: undefined,
	multipleSelectedPanelIds: [],
	selectedStringId: undefined,
	selectedPanelLinkId: undefined,
	entityState: ENTITY_SELECTED_STATE.NONE_SELECTED,
	selectedPanelsBoxBounds: undefined,
	selectedStringBoxBounds: undefined,
}

const reducer = createReducer(
	initialSelectedState,

	/**
	 * * Single Selected Entity
	 */
	on(SelectedActions.selectPanel, (state, { panelId }) => ({
		...state,
		singleSelectedPanelId: panelId,
		multipleSelectedPanelIds: [],
		entityState: ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED,
	})),

	on(SelectedActions.clearSingleSelected, (state) => ({
		...state,
		singleSelectedPanelId: undefined,
		entityState: ENTITY_SELECTED_STATE.NONE_SELECTED,
	})),

	/**
	 * * Multi Selected Entities
	 */

	on(SelectedActions.selectMultiplePanels, (state, { panelIds }) => ({
		...state,
		multipleSelectedPanelIds: panelIds,
		singleSelectedPanelId: undefined,
		entityState: ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED,
	})),

	on(SelectedActions.addPanelsToMultiSelect, (state, { panelIds }) => ({
		...state,
		multipleSelectedPanelIds: [...state.multipleSelectedPanelIds, ...panelIds],
		entityState: ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED,
		singleSelectedPanelId: undefined,
	})),

	on(SelectedActions.removePanelsFromMultiSelect, (state, { panelIds }) => ({
		...state,
		multipleSelectedPanelIds: state.multipleSelectedPanelIds.filter((id) => !panelIds.includes(id)),
		get entityState() {
			if (state.multipleSelectedPanelIds.length === 0) {
				return ENTITY_SELECTED_STATE.NONE_SELECTED
			} else if (state.multipleSelectedPanelIds.length === 1) {
				return ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED
			} else {
				return ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED
			}
		},
	})),

	on(SelectedActions.setSelectedPanelsBoxBounds, (state, { bounds }) => ({
		...state,
		selectedPanelsBoxBounds: bounds,
	})),

	on(SelectedActions.clearMultiSelected, (state) => ({
		...state,
		selectedPanelsBoxBounds: undefined,
		entityState:
			ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED || ENTITY_SELECTED_STATE.NONE_SELECTED,
		multipleSelectedPanelIds: [],
		singleSelectedPanelId: undefined,
	})),

	/**
	 * * Selected String
	 */

	on(SelectedActions.selectString, (state, { stringId }) => ({
		...state,
		selectedStringId: stringId,
		multipleSelectedPanelIds: [],
		singleSelectedPanelId: undefined,
	})),

	on(SelectedActions.setSelectedStringBoxBounds, (state, { bounds }) => ({
		...state,
		selectedStringBoxBounds: bounds,
	})),

	on(SelectedActions.clearSelectedString, (state) => ({
		...state,
		selectedStringBoxBounds: undefined,
		selectedStringId: undefined,
	})),

	/**
	 * * Selected Link Path
	 */

	on(SelectedActions.selectPanelLink, (state, { panelLinkId }) => ({
		...state,
		selectedPanelLinkId: panelLinkId,
	})),

	on(SelectedActions.clearSelectedPanelLink, (state) => ({
		...state,
		selectedPanelLinkId: undefined,
	})),

	/**
	 * * Clear Selected State
	 */

	on(SelectedActions.clearSelectedState, () => ({
		...initialSelectedState,
	})),
)

export function selectedReducer(state: SelectedState | undefined, action: Action) {
	return reducer(state, action)
}
