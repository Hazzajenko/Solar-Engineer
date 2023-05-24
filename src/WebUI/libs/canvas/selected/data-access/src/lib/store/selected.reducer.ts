import { SelectedActions } from './selected.actions'
import { Action, createReducer, on } from '@ngrx/store'
import { PanelLinkId, StringId } from '@entities/shared'

export const SELECTED_FEATURE_KEY = 'selected'

export const ENTITY_SELECTED_STATE = {
	SINGLE_ENTITY_SELECTED: 'SingleEntitySelected',
	MULTIPLE_ENTITIES_SELECTED: 'MultipleEntitiesSelected',
	NONE_SELECTED: 'NoneSelected',
} as const

export type EntitySelectedState = (typeof ENTITY_SELECTED_STATE)[keyof typeof ENTITY_SELECTED_STATE]

export interface SelectedState {
	singleSelectedEntityId: string | undefined
	multipleSelectedEntityIds: string[]
	selectedStringId: StringId | undefined
	selectedPanelLinkId: PanelLinkId | undefined
	entityState: EntitySelectedState
}

export const initialSelectedState: SelectedState = {
	singleSelectedEntityId: undefined,
	multipleSelectedEntityIds: [],
	selectedStringId: undefined,
	selectedPanelLinkId: undefined,
	entityState: ENTITY_SELECTED_STATE.NONE_SELECTED,
}

const reducer = createReducer(
	initialSelectedState,

	/**
	 * * Single Selected Entity
	 */
	on(SelectedActions.selectEntity, (state, { entityId }) => ({
		...state,
		singleSelectedEntityId: entityId,
		multipleSelectedEntityIds: [],
		entityState: ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED,
	})),

	on(SelectedActions.clearSingleSelected, (state) => ({
		...state,
		singleSelectedEntityId: undefined,
		entityState: ENTITY_SELECTED_STATE.NONE_SELECTED,
	})),

	/**
	 * * Multi Selected Entities
	 */

	on(SelectedActions.selectMultipleEntities, (state, { entityIds }) => ({
		...state,
		multipleSelectedEntityIds: entityIds,
		singleSelectedEntity: undefined,
		entityState: ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED,
	})),

	on(SelectedActions.addEntitiesToMultiSelect, (state, { entityIds }) => ({
		...state,
		multipleSelectedEntityIds: [...state.multipleSelectedEntityIds, ...entityIds],
		entityState: ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED,
		singleSelectedEntityId: undefined,
	})),

	on(SelectedActions.removeEntitiesFromMultiSelect, (state, { entityIds }) => ({
		...state,
		multipleSelectedEntityIds: state.multipleSelectedEntityIds.filter(
			(id) => !entityIds.includes(id),
		),
		get entityState() {
			if (state.multipleSelectedEntityIds.length === 0) {
				return ENTITY_SELECTED_STATE.NONE_SELECTED
			} else if (state.multipleSelectedEntityIds.length === 1) {
				return ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED
			} else {
				return ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED
			}
		},
	})),

	on(SelectedActions.clearMultiSelected, (state) => ({
		...state,
		entityState:
			ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED || ENTITY_SELECTED_STATE.NONE_SELECTED,
		multipleSelectedEntityIds: [],
		singleSelectedEntityId: undefined,
	})),

	/**
	 * * Selected String
	 */

	on(SelectedActions.selectString, (state, { stringId }) => ({
		...state,
		selectedStringId: stringId,
	})),

	on(SelectedActions.clearSelectedString, (state) => ({
		...state,
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
