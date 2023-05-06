import { DialogInput } from '../dialogs'
import { ContextMenuType } from '../view'
import {
	ContextMenuOpenState,
	DragBoxState,
	ModeState,
	PreviewAxisState,
	ViewPositioningState,
} from './app-state.types'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const AppStateActions = createActionGroup({
	source: 'App State Store',
	events: {
		'Set Drag Box State': props<{
			dragBox: DragBoxState
		}>(),
		'Set Hovering Over Entity': props<{
			hoveringOverEntityId: string
		}>(),
		'Lift Hovering Over Entity': emptyProps(),
		'Set View Positioning State': props<{
			view: ViewPositioningState
		}>(),
		'Set Mode State': props<{
			mode: ModeState
		}>(),
		'Set Preview Axis State': props<{
			previewAxis: PreviewAxisState
		}>(),
		'Set Context Menu State': props<{
			contextMenu: ContextMenuOpenState
		}>(),
		'Open Context Menu': props<{
			contextMenuType: ContextMenuType
		}>(),
		'Close Context Menu': emptyProps(),
		'Set Dialog State': props<{
			dialog: boolean
		}>(),
		'Toggle Dialog State': emptyProps(),
		'Add Dialog': props<{
			dialog: DialogInput<unknown>
		}>(),
		'Remove Dialog': props<{
			dialogId: string
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