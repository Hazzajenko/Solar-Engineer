import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  SIGNALR_EVENTS_FEATURE_KEY,
  signalrEventsEntityAdapter,
  SignalrEventsState,
} from './signalr-events.reducer'
import { ProjectSignalrEvent } from '@shared/data-access/models'

export const selectSignalrEventsState = createFeatureSelector<SignalrEventsState>(
  SIGNALR_EVENTS_FEATURE_KEY,
)

const { selectAll } = signalrEventsEntityAdapter.getSelectors()

export const selectAllSignalrEvents = createSelector(
  selectSignalrEventsState,
  (state: SignalrEventsState) => selectAll(state),
)

export const selectSignalrEventByRequestId = (props: { requestId: string }) =>
  createSelector(selectAllSignalrEvents, (signalrEvents: ProjectSignalrEvent[]) =>
    signalrEvents.find((projectEvent) => projectEvent.requestId === props.requestId),
  )
