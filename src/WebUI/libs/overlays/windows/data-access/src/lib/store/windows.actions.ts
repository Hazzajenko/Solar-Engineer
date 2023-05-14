import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DraggableWindow } from '@shared/data-access/models'

export const WindowsActions = createActionGroup({
	source: 'Windows Store',
	events: {
		'Add Window': props<{
			window: DraggableWindow
		}>(),
		'Update Window': props<{
			update: UpdateStr<DraggableWindow>
		}>(),
		'Delete Window': props<{
			windowId: string
		}>(),
		'Clear Windows State': emptyProps(),
	},
})
