import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const ObjectPositioningActions = createActionGroup({
	source: 'Object Positioning Store',
	events: {
		'Start Moving Single Entity': props<{
			entityId: string
		}>(),
		'Start Moving Multiple Entities': props<{
			entityIds: string[]
		}>(),
		'Set Moving Spot Taken': emptyProps(),
		'Set Moving Spot Free': emptyProps(),
		'Set Multiple Moving Spots Taken': props<{
			toMoveMultipleSpotTakenIds: string[]
		}>(),
		'Clear Multiple Moving Spots Taken': emptyProps(),
		'Stop Moving': emptyProps(),
		'Start Rotating Single Entity': props<{
			entityId: string
		}>(),
		'Start Rotating Multiple Entities': props<{
			entityIds: string[]
		}>(),
		'Stop Rotating': emptyProps(),
		'Clear Object Positioning State': emptyProps(),
	},
})
