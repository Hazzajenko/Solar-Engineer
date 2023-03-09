import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

import { SignalrEventsActions } from './signalr-events.actions'
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
  on(SignalrEventsActions.addSignalrEvent, (state, { projectSignalrEvent }) =>
    signalrEventsEntityAdapter.addOne(projectSignalrEvent, state),
  ),
  on(SignalrEventsActions.addManySignalrEvents, (state, { projectSignalrEvents }) =>
    signalrEventsEntityAdapter.addMany(projectSignalrEvents, state),
  ),
  on(SignalrEventsActions.sendSignalrEvent, (state, { projectSignalrEvent }) =>
    signalrEventsEntityAdapter.addOne(projectSignalrEvent, state),
  ),
  on(SignalrEventsActions.updateSignalrEvent, (state, { update }) =>
    signalrEventsEntityAdapter.updateOne(update, state),
  ),
  on(SignalrEventsActions.updateManySignalrEvents, (state, { updates }) =>
    signalrEventsEntityAdapter.updateMany(updates, state),
  ),
)

export function signalrEventsReducer(state: SignalrEventsState | undefined, action: Action) {
  return reducer(state, action)
}
