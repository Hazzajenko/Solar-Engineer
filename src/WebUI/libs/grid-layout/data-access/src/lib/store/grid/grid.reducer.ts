import { ClientXY } from '../../models'
import { GridActions } from './grid.actions'
import { Action, createReducer, on } from '@ngrx/store'
import { BLOCK_TYPE, BlockType, GridMode } from '@shared/data-access/models'

export const GRID_FEATURE_KEY = 'grid'

export interface GridState {
	createMode: BlockType
	gridMode: GridMode
	clientXY: ClientXY
}

export const initialGridState: GridState = {
	createMode: BLOCK_TYPE.PANEL,
	gridMode: GridMode.SELECT,
	clientXY: {
		clientX: undefined,
		clientY: undefined,
	},
}

export const reducer = createReducer(
	initialGridState,

	on(GridActions.changeCreateType, (state, { createType }) => ({
		...state,
		createMode: createType,
	})),

	on(GridActions.clearGridState, (state) => ({
		...state,
		gridMode: GridMode.SELECT,
	})),

	on(GridActions.selectGridModeCreate, (state) => ({
		...state,
		gridMode: GridMode.CREATE,
	})),

	on(GridActions.selectGridModeDelete, (state) => ({
		...state,
		gridMode: GridMode.DELETE,
	})),

	on(GridActions.selectGridModeLink, (state) => ({
		...state,
		gridMode: GridMode.LINK,
	})),

	on(GridActions.selectGridModeSelect, (state) => ({
		...state,
		gridMode: GridMode.SELECT,
	})),

	on(GridActions.setClientXY, (state, { clientXY }) => ({
		...state,
		clientXY,
	})),
	on(GridActions.clearClientXY, (state) => ({
		...state,
		clientXY: {
			clientX: undefined,
			clientY: undefined,
		},
	})),
)

export function gridReducer(state: GridState | undefined, action: Action) {
	return reducer(state, action)
}