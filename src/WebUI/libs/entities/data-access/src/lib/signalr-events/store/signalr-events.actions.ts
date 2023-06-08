import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { RequestId, SignalrEventRequest } from '@entities/shared'

export const SignalrEventsActions = createActionGroup({
	source: 'Signalr Events Store',
	events: {
		'Add Signalr Event': props<{
			signalrEvent: SignalrEventRequest
		}>(),
		'Add Many Signalr Events': props<{
			signalrEvents: SignalrEventRequest[]
		}>(),
		'Update Signalr Event': props<{
			update: UpdateStr<SignalrEventRequest>
		}>(),
		'Update Many Signalr Events': props<{
			updates: UpdateStr<SignalrEventRequest>[]
		}>(),
		'Delete Signalr Event': props<{
			signalrEventId: RequestId
		}>(),
		'Delete Many Signalr Events': props<{
			signalrEventIds: RequestId[]
		}>(),
		'Clear Signalr Events State': emptyProps(),
		Noop: emptyProps(),
	},
})
