import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from './app-state.reducer'
import { appStateFeature } from './app-state.feature'
import { AppStateActions } from './app-state.actions'
import { DragBoxState, ModeState, PreviewAxisState, ViewPositioningState } from './app-state.types'
import { string } from 'zod'
import { TypedAction } from '@ngrx/store/src/models'

export function injectAppStateStore() {
	const store = inject(Store<AppState>)
	const appState = () => store.selectSignal(appStateFeature.selectAppStateState)()
	const dragBox = () => store.selectSignal(v.selectDragBox)()
	const mode = () => store.selectSignal(appStateFeature.selectMode)()
	const pointer = () => store.selectSignal(appStateFeature.selectPointer)()
	const view = () => store.selectSignal(appStateFeature.selectView)()
	const previewAxis = () => store.selectSignal(appStateFeature.selectPreviewAxis)()
	const setHoveringOverEntityState = (hoveringOverEntityId: string) =>
		store.dispatch(AppStateActions.setHoveringOverEntity({ hoveringOverEntityId }))
	const liftHoveringOverEntity = () => store.dispatch(AppStateActions.liftHoveringOverEntity())

	const setDragBoxState = (dragBox: DragBoxState) =>
		store.dispatch(AppStateActions.setDragBoxState({ dragBox }))

	const setViewPositioningState = (view: ViewPositioningState) =>
		store.dispatch(AppStateActions.setViewPositioningState({ view }))

	const setModeState = (mode: ModeState) => store.dispatch(AppStateActions.setModeState({ mode }))
	const setPreviewAxisState = (previewAxis: PreviewAxisState) =>
		store.dispatch(AppStateActions.setPreviewAxisState({ previewAxis }))

	return {
		appState,
		dragBox,
		mode,
		pointer,
		view,
		previewAxis,
		setHoveringOverEntityState,
		liftHoveringOverEntity,
		setDragBoxState,
		setViewPositioningState,
		setModeState,
		setPreviewAxisState,
	}
}
AppStateActions['setModeState'].call(AppStateActions, { mode: 'LinkMode' })
export type AppStoreActions = typeof AppStateActions
export type AppStoreSelectors = Omit<typeof appStateFeature, 'name' | 'reducer'>
appStateFeature.reducer(AppState, AppStoreActions[K])
export type ActionsOf<T> = {
	[K in keyof T]: {
		key: K
	}
}[keyof T]

type ActionsV1 = {
	[K in keyof AppStoreActions]: {
		key: K
		// params: appStateFeature.reducer(AppState, AppStoreActions[K])
	}
}[keyof AppStoreActions]

type ActionsV2 = {
	[K in keyof AppStoreActions]: {
		key: K
		params: Parameters<AppStoreActions[K]>
	}
}[keyof AppStoreActions]

const asdas: ActionsV2 = {
	key: 'setHoveringOverEntity',
	params: [{ hoveringOverEntityId: 'test' }],
}

type ActionsV3 = {
	[K in keyof AppStoreActions]: (key: K, ...params: Parameters<AppStoreActions[K]>) => ReturnType<AppStoreActions[K]>
}[keyof AppStoreActions]

const assaddas: ActionsV3 = (, params) => {}

type ActionsV4 = {
	[K in keyof AppStoreActions]: (...params: Parameters<AppStoreActions[K]>) => ReturnType<AppStoreActions[K]>
}

const assaddas: ActionsV4 = {
	setHoveringOverEntity: (params) => {},
}
export type AppStoreActionFunctions = {
	[K in keyof AppStoreActions]: AppStoreActions[K] extends (...args: any[]) => any
		? AppStoreActions[K]
		: never
}

const funnc: AppStoreActionFunctions = {
	setHoveringOverEntity: (props: { hoveringOverEntityId: string }) =>
		({ hoveringOverEntityId: string } & TypedAction<'[App State Store] Set Hovering Over Entity'>),
	liftHoveringOverEntity: () => {},
	setDragBoxState: () => {},
	setModeState: () => {},
	setPreviewAxisState: () => {},
	setViewPositioningState: () => {},
	clearState: () => {},
}

const test: AppStoreActionFunctions['setHoveringOverEntity'] = {
	type: '[App State Store] Set Hovering Over Entity',
	arguments: { hoveringOverEntityId: 'test' },
}

const idk = ActionCreator<
	'[App State Store] Set Hovering Over Entity',
	(props: { hoveringOverEntityId: string }) => {
		hoveringOverEntityId: string
	} & TypedAction<'[App State Store] Set Hovering Over Entity'>
>

export type AppStoreSelectorFunctions = {
	[K in keyof AppStoreSelectors]: AppStoreSelectors[K] extends (...args: any[]) => any
		? AppStoreSelectors[K]
		: never
}
export const appStore = {}
