import { createFeatureSelector, createSelector } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import { SignalrEventRequest } from '@entities/shared'
import {
	SIGNALR_EVENTS_FEATURE_KEY,
	signalrEventsAdapter,
	SignalrEventsState,
} from './signalr-events.reducer'

export const selectSignalrEventsState = createFeatureSelector<SignalrEventsState>(
	SIGNALR_EVENTS_FEATURE_KEY,
)

const { selectAll, selectEntities } = signalrEventsAdapter.getSelectors()

export const selectAllSignalrEvents = createSelector(
	selectSignalrEventsState,
	(state: SignalrEventsState) => selectAll(state),
)

export const selectSignalrEventsEntities = createSelector(
	selectSignalrEventsState,
	(state: SignalrEventsState) => selectEntities(state),
)

export const selectSignalrEventById = (props: { id: string }) =>
	createSelector(
		selectSignalrEventsEntities,
		(projects: Dictionary<SignalrEventRequest>) => projects[props.id],
	)
