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
		toggleNearbyLines: emptyProps(),
		'Toggle Coloured Strings': emptyProps(),
		'Toggle Selected Panel Fill': emptyProps(),
		'Toggle Selected String Panel Fill': emptyProps(),
		toggleStringBoxes: emptyProps(),
		toggleLinkModeSymbols: emptyProps(),
		toggleLinkModeOrderNumbers: emptyProps(),
		'Toggle Link Mode Path Lines': emptyProps(),
		'Toggle Notifications': emptyProps(),
		'Reset Graphics To Default': emptyProps(),
	},
})
