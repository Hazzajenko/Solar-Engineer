import { CanvasString } from '../../types/canvas-string'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const CanvasStringsActions = createActionGroup({
	source: 'Canvas Strings Store',
	events: {
		'Add String': props<{
			string: CanvasString
		}>(),
		'Add Many Strings': props<{
			strings: CanvasString[]
		}>(),
		'Update String': props<{
			update: UpdateStr<CanvasString>
		}>(),
		'Update Many Strings': props<{
			updates: UpdateStr<CanvasString>[]
		}>(),
		'Delete String': props<{
			stringId: string
		}>(),
		'Delete Many Strings': props<{
			stringIds: string[]
		}>(),
		'Clear Canvas Strings State': emptyProps(),
	},
})
