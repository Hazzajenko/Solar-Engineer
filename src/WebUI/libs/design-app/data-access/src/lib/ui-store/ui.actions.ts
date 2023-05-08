import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ContextMenuInput } from './context-menu'
import { DialogInput } from './dialog-inputs'

export const UiActions = createActionGroup({
	source: 'Ui Store',
	events: {
		'Open Context Menu': props<{
			contextMenu: ContextMenuInput
		}>(),
		'Close Context Menu': emptyProps(),
		'Open Dialog': props<{
			dialog: DialogInput
		}>(),
		'Close Dialog': emptyProps(),
		'Toggle Side Ui Nav': emptyProps(),
		'Clear Ui State': emptyProps(),
	},
})
