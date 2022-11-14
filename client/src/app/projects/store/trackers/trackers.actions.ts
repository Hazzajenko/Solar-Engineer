import { createAction, props } from '@ngrx/store'
import { TrackerModel } from '../../models/tracker.model'

export const addTracker = createAction(
  '[Trackers Service] Add Tracker',
  props<{ tracker: TrackerModel }>(),
)

export const addTrackersToInverter = createAction(
  '[Trackers Service] Add Trackers to Inverter',
  props<{ trackers: TrackerModel[] }>(),
)

export const addTrackers = createAction(
  '[Trackers Service] Add Trackers By InverterId',
  props<{ trackers: TrackerModel[] }>(),
)

export const updateTracker = createAction(
  '[Trackers Service] Update Tracker',
  props<{ tracker: TrackerModel }>(),
)

export const deleteTracker = createAction(
  '[Trackers Service] Delete Tracker',
  props<{ trackerId: number }>(),
)
