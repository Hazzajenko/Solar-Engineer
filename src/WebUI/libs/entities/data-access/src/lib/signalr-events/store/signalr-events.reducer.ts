import { SignalrEventsActions } from './signalr-events.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { SignalrEventRequest } from '@entities/shared'

export const SIGNALR_EVENTS_FEATURE_KEY = 'signalrEvents'

export interface SignalrEventsState extends EntityState<SignalrEventRequest> {
	loaded: boolean
	error?: string | null
}

export const signalrEventsAdapter: EntityAdapter<SignalrEventRequest> =
	createEntityAdapter<SignalrEventRequest>({
		selectId: (string) => string.requestId,
	})

export const initialSignalrEventsState: SignalrEventsState = signalrEventsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialSignalrEventsState,
	on(SignalrEventsActions.invokeSignalrEvent, (state, { signalrEvent }) =>
		signalrEventsAdapter.addOne(signalrEvent, state),
	),
	on(SignalrEventsActions.addSignalrEvent, (state, { signalrEvent }) =>
		signalrEventsAdapter.addOne(signalrEvent, state),
	),
	on(SignalrEventsActions.addManySignalrEvents, (state, { signalrEvents }) =>
		signalrEventsAdapter.addMany(signalrEvents, state),
	),
	on(SignalrEventsActions.updateSignalrEvent, (state, { update }) =>
		signalrEventsAdapter.updateOne(update, state),
	),
	on(SignalrEventsActions.updateManySignalrEvents, (state, { updates }) =>
		signalrEventsAdapter.updateMany(updates, state),
	),
	on(SignalrEventsActions.deleteSignalrEvent, (state, { signalrEventId }) =>
		signalrEventsAdapter.removeOne(signalrEventId, state),
	),
	on(SignalrEventsActions.deleteManySignalrEvents, (state, { signalrEventIds }) =>
		signalrEventsAdapter.removeMany(signalrEventIds, state),
	),
	on(SignalrEventsActions.clearSignalrEventsState, () => initialSignalrEventsState),
)

export function signalrEventsReducer(state: SignalrEventsState | undefined, action: Action) {
	return reducer(state, action)
}
