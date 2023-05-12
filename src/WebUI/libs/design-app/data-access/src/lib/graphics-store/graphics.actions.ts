import { NearbyLinesState } from './graphics.types'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const GraphicsActions = createActionGroup({
	source: 'Graphics Store',
	events: {
		/*		'Set Create Preview': props<{
		 createPreview: CreatePreviewState
		 }>(),*/
		'Toggle Create Preview': emptyProps(),
		'Toggle Nearby Lines': emptyProps(),
		'Set Nearby Lines': props<{
			nearbyLines: NearbyLinesState
		}>(),
		'Toggle Coloured Strings': emptyProps(),
		'Toggle Selected Panel Fill': emptyProps(),
		'Toggle Selected String Panel Fill': emptyProps(),
		toggleStringBoxes: emptyProps(),
		toggleLinkModeSymbols: emptyProps(),
		toggleLinkModeOrderNumbers: emptyProps(),
		'Reset Graphics To Default': emptyProps(),
	},
})
