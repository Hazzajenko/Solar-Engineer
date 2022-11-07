import { createAction, props } from '@ngrx/store';
import { TrackerModel } from '../../models/tracker.model';

export const addTracker = createAction(
  '[Trackers Service] Add Tracker',
  props<{ tracker: TrackerModel }>()
);

export const addTrackersToInverter = createAction(
  '[Trackers Service] Add Trackers to Inverter',
  props<{ trackers: TrackerModel[] }>()
);

export const addTrackersByProjectId = createAction(
  '[Trackers Service] Add Trackers By InverterId',
  props<{ trackers: TrackerModel[] }>()
);
