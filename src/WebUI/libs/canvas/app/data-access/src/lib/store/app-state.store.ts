import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from './app-state.reducer'
import { appStateFeature } from './app-state.feature'
import { AppStateActions } from './app-state.actions'
import { DragBoxState, ModeState, PreviewAxisState, ViewPositioningState } from './app-state.types'

export function injectAppStateStore() {
	const store = inject(Store<AppState>)
	const appState = () => store.selectSignal(appStateFeature.selectAppStateState)()
	const dragBox = () => store.selectSignal(appStateFeature.selectDragBox)()
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
