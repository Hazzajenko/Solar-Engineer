import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as State from './trackers.reducer';
import { selectRouteParams } from '../../../store/router.selectors';

export const selectTrackersState =
  createFeatureSelector<State.TrackerState>('trackers');

export const selectTrackerEntities = createSelector(
  selectTrackersState,
  State.selectEntities
);

export const selectAllTrackers = createSelector(
  selectTrackersState,
  State.selectAll
);

export const selectTrackerByRouteParams = createSelector(
  selectTrackerEntities,
  selectRouteParams,
  (trackers, { trackerId }) => trackers[trackerId]
);

export const selectTrackersByInverterIdRouteParams = createSelector(
  selectAllTrackers,
  selectRouteParams,
  (trackers, { inverterId }) =>
    trackers.filter((tracker) => tracker.inverterId === Number(inverterId))
);
