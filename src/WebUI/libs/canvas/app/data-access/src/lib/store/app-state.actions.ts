import { DragBox, ModeState, PreviewAxisState, ViewPositioningState } from './app-state.types'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelId } from '@entities/shared'

export const AppStateActions = createActionGroup({
	source: 'App State Store',
	events: {
		'Set Drag Box State': props<{
			dragBox: DragBox
		}>(),
		'Set Hovering Over Panel': props<{
			hoveringOverPanelId: PanelId
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
		}>() /*		'Set Context Menu State': props<{
		 contextMenu: ContextMenuOpenState
		 }>(),
		 'Open Context Menu': props<{
		 contextMenuType: ContextMenuType
		 }>(),
		 'Close Context Menu': emptyProps()*/ /*		'Set Dialog State': props<{
		 dialog: boolean
		 }>(),*/ /*		'Toggle Dialog State': emptyProps(),
		 'Add Dialog': props<{
		 dialog: DialogInput
		 }>(),
		 'Update Dialog': props<{
		 update: UpdateStr<DialogInput>
		 }>(),
		 'Remove Dialog': props<{
		 dialogId: string
		 }>(),*/,
		'Clear State': emptyProps(),
	},
})

/*AppStateActions['setDragBoxState']({dragBox: {} as DragBoxState})

 export const APP_STATE_ACTIONS = AppStateActions
 export type AppStateActions = typeof AppStateActions*/
// const sdads: AppStateActions = {
// clearState: (): ActionCreator Typed => {},
// }
