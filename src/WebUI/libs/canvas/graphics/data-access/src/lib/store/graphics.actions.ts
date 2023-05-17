import { NearbyLinesState } from './graphics.types'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const GraphicsActions = createActionGroup({
	source: 'Graphics Store',
	events: {
		/*		'Set Create Preview': props<{
		 createPreview: CreatePreviewState
		 }>(),*/
		'Toggle Create Preview': emptyProps(),
		'Set Nearby Lines': props<{
			nearbyLines: NearbyLinesState
		}>(),
		'Toggle Nearby Lines': emptyProps(),
		'Toggle Coloured Strings': emptyProps(),
		'Toggle Selected Panel Fill': emptyProps(),
		'Toggle Selected String Panel Fill': emptyProps(),
		'Toggle String Boxes': emptyProps(),
		'Toggle Link Mode Symbols': emptyProps(),
		'Toggle Link Mode Order Numbers': emptyProps(),
		'Toggle Link Mode Path Lines': emptyProps(),
		'Toggle Notifications': emptyProps(),
		'Toggle Show FPS': emptyProps(),
		'Reset Graphics To Default': emptyProps(),
	},
})
