import { CreatePreviewState, NearbyLinesState } from './graphics.types'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const GraphicsActions = createActionGroup({
	source: 'Graphics Store',
	events: {
		'Set Create Preview': props<{
			createPreview: CreatePreviewState
		}>(),
		'Set Nearby Lines': props<{
			nearbyLines: NearbyLinesState
		}>(),
		'Reset Graphics To Default': emptyProps(),
	},
})