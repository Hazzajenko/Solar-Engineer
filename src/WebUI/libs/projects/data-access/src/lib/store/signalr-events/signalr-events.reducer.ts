import { SignalrEventsActions } from './signalr-events.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ProjectSignalrEvent } from '@shared/data-access/models'

export const SIGNALR_EVENTS_FEATURE_KEY = 'signalr-events'

export interface SignalrEventsState extends EntityState<ProjectSignalrEvent> {
	loaded: boolean
	error?: string | null
}

export const signalrEventsEntityAdapter: EntityAdapter<ProjectSignalrEvent> =
	createEntityAdapter<ProjectSignalrEvent>({
		selectId: (a) => a.requestId,
	})

export const initialSignalrEventsState: SignalrEventsState =
	signalrEventsEntityAdapter.getInitialState({
		loaded: false,
	})

const reducer = createReducer(
	initialSignalrEventsState,
	on(SignalrEventsActions.addSignalREvent, (state, { projectSignalrEvent }) =>
		signalrEventsEntityAdapter.addOne(projectSignalrEvent, state),
	),
	on(SignalrEventsActions.addManySignalREvents, (state, { projectSignalrEvents }) =>
		signalrEventsEntityAdapter.addMany(projectSignalrEvents, state),
	),
	on(SignalrEventsActions.sendSignalREvent, (state, { projectSignalrEvent }) =>
		signalrEventsEntityAdapter.addOne(projectSignalrEvent, state),
	),
	on(SignalrEventsActions.updateSignalREvent, (state, { update }) =>
		signalrEventsEntityAdapter.updateOne(update, state),
	),
	on(SignalrEventsActions.updateManySignalREvents, (state, { updates }) =>
		signalrEventsEntityAdapter.updateMany(updates, state),
	),
)

export function signalrEventsReducer(state: SignalrEventsState | undefined, action: Action) {
	return reducer(state, action)
}