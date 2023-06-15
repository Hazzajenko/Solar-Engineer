import { Store } from '@ngrx/store'
import { appStateFeature } from './app-state.feature'
import { AppStateActions } from './app-state.actions'
import { DragBox, ModeState, PreviewAxisState, ViewPositioningState } from './app-state.types'
import { PanelId, StringColor } from '@entities/shared'
import { createRootServiceInjector } from '@shared/utils'

// export type AppStateStore = ReturnType<typeof injectAppStateStore>

export function injectAppStateStore(): AppStateStore {
	return appStoreInjector()
}

const appStoreInjector = createRootServiceInjector(appStoreFactory, {
	deps: [Store],
})

export type AppStateStore = ReturnType<typeof appStoreFactory>

function appStoreFactory(store: Store) {
	const appState = () => store.selectSignal(appStateFeature.selectAppStateState)()
	const dragBox = () => store.selectSignal(appStateFeature.selectDragBox)()
	const mode = () => store.selectSignal(appStateFeature.selectMode)()
	const pointer = () => store.selectSignal(appStateFeature.selectPointer)()
	const view = () => store.selectSignal(appStateFeature.selectView)()
	const previewAxis = () => store.selectSignal(appStateFeature.selectPreviewAxis)()

	const stringColor = () => store.selectSignal(appStateFeature.selectStringColor)()

	const select = {
		appState,
		dragBox,
		mode,
		pointer,
		view,
		previewAxis,
		stringColor,
	}

	const setStringColor = (stringColor: StringColor) =>
		store.dispatch(AppStateActions.setStringColor({ stringColor }))
	const setHoveringOverEntityState = (hoveringOverPanelId: PanelId) =>
		store.dispatch(AppStateActions.setHoveringOverPanel({ hoveringOverPanelId }))
	const liftHoveringOverEntity = () => store.dispatch(AppStateActions.liftHoveringOverEntity())

	const setDragBoxState = (dragBox: DragBox) =>
		store.dispatch(AppStateActions.setDragBoxState({ dragBox }))

	const setViewPositioningState = (view: ViewPositioningState) =>
		store.dispatch(AppStateActions.setViewPositioningState({ view }))

	const setModeState = (mode: ModeState) => store.dispatch(AppStateActions.setModeState({ mode }))
	const setPreviewAxisState = (previewAxis: PreviewAxisState) =>
		store.dispatch(AppStateActions.setPreviewAxisState({ previewAxis }))

	const dispatch = {
		setHoveringOverEntityState,
		liftHoveringOverEntity,
		setDragBoxState,
		setViewPositioningState,
		setModeState,
		setPreviewAxisState,
		setStringColor,
	}

	return {
		select,
		dispatch,
	}
}
