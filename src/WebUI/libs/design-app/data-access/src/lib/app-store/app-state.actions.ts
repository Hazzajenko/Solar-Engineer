import {
	ContextMenuState,
	DragBoxState,
	ModeState,
	PointerState,
	PreviewAxisState,
	SelectedState,
	ToMoveState,
	ToRotateState,
	ViewPositioningState,
} from './app-state.types'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const AppStateActions = createActionGroup({
	source: 'App State Store',
	events: {
		'Set Drag Box State': props<{
			dragBox: DragBoxState
		}>(),
		'Set Pointer State': props<{
			pointer: PointerState
		}>(),
		'Set To Move State': props<{
			toMove: ToMoveState
		}>(),
		'Set To Rotate State': props<{
			toRotate: ToRotateState
		}>(),
		'Set View Positioning State': props<{
			view: ViewPositioningState
		}>(),
		'Set Preview Axis State': props<{
			previewAxis: PreviewAxisState
		}>(),
		'Set Mode State': props<{
			mode: ModeState
		}>(),
		'Set Context Menu State': props<{
			contextMenu: ContextMenuState
		}>(),
		'Set Selected State': props<{
			selected: SelectedState
		}>(),
		'Clear State': emptyProps(),
	},
})

/*AppStateActions['setDragBoxState']({dragBox: {} as DragBoxState})

export const APP_STATE_ACTIONS = AppStateActions
export type AppStateActions = typeof AppStateActions*/
// const sdads: AppStateActions = {
// clearState: (): ActionCreator Typed => {},
// }
