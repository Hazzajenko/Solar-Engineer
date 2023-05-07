import { ClientXY, GridLayoutXY, MouseXY, PosXY } from '../..'
import { UiActions } from './ui.actions'
import { Action, createReducer, on } from '@ngrx/store'
import { WindowSizeModel } from '@shared/data-access/models'

export const UI_FEATURE_KEY = 'ui'

export interface UiState {
	createProjectOverlay: boolean
	keymap: boolean
	navMenu: boolean
	pathLines: boolean
	stringStats: boolean
	gridLayoutXY: GridLayoutXY
	gridLayoutZoom: number
	gridLayoutMoving: boolean
	clientXY: ClientXY
	mouseXY: MouseXY
	posXY: PosXY
	keyPressed: string
	scale: number
	windowSize: WindowSizeModel
}

export const initialUiState: UiState = {
	createProjectOverlay: false,
	keymap: true,
	navMenu: false,
	pathLines: true,
	stringStats: true,
	gridLayoutXY: {
		componentX: undefined,
		componentY: undefined,
	},
	gridLayoutZoom: 1,
	gridLayoutMoving: false,
	mouseXY: {
		mouseX: undefined,
		mouseY: undefined,
	},
	posXY: {
		posX: undefined,
		posY: undefined,
	},
	clientXY: {
		clientX: undefined,
		clientY: undefined,
	},
	keyPressed: '',
	scale: 1,
	windowSize: {
		innerHeight: undefined,
		innerWidth: undefined,
	},
}

const reducer = createReducer(
	initialUiState,
	on(UiActions.toggleKeymap, (state) => ({ ...state, keymap: !state.keymap })),
	on(UiActions.toggleCreateProjectOverlay, (state) => ({
		...state,
		createProjectOverlay: !state.createProjectOverlay,
	})),
	on(UiActions.togglePathLines, (state) => ({ ...state, pathLines: !state.pathLines })),
	on(UiActions.toggleStringStatistics, (state) => ({ ...state, stringStats: !state.stringStats })),
	on(UiActions.setGridLayoutComponentXY, (state, { gridLayoutXY }) => ({
		...state,
		gridLayoutXY,
	})),
	on(UiActions.stopGridLayoutMoving, (state) => ({ ...state, gridLayoutMoving: false })),
	on(UiActions.resetGridLayoutComponentXY, (state) => ({
		...state,
		gridLayoutXY: {
			componentX: undefined,
			componentY: undefined,
		},
		gridLayoutMoving: false,
	})),
	on(UiActions.setGridLayoutZoom, (state, { zoom }) => ({ ...state, gridLayoutZoom: zoom })),
	on(UiActions.resetGridLayoutZoom, (state) => ({
		...state,
		zoom: 1,
	})),
	on(UiActions.setMouseXY, (state, { mouseXY }) => ({
		...state,
		mouseXY,

		gridLayoutMoving: true,
	})),
	on(UiActions.resetMouseXY, (state) => ({
		...state,
		mouseXY: {
			mouseX: undefined,
			mouseY: undefined,
		},

		gridLayoutMoving: true,
	})),
	on(UiActions.setPosXY, (state, { posXY }) => ({
		...state,
		posXY,
	})),
	on(UiActions.resetPosXY, (state) => ({
		...state,
		posXY: {
			posX: undefined,
			posY: undefined,
		},

		gridLayoutMoving: true,
	})),
	on(UiActions.keyPressed, (state, { key }) => ({
		...state,
		keyPressed: key,
	})),
	on(UiActions.setScale, (state, { scale }) => ({
		...state,
		scale,
	})),
	on(UiActions.setClientXY, (state, { clientXY }) => ({
		...state,
		clientXY,
	})),
	on(UiActions.toggleNavMenu, (state) => ({
		...state,
		navMenu: !state.navMenu,
	})),
	on(UiActions.clearClientXY, (state) => ({
		...state,
		clientXY: {
			clientX: undefined,
			clientY: undefined,
		},
	})),
	on(UiActions.setWindowSize, (state, { windowSize }) => ({
		...state,
		windowSize,
	})),
)

export function uiReducer(state: UiState | undefined, action: Action) {
	return reducer(state, action)
}