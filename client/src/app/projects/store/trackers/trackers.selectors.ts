import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as State from './trackers.reducer';
import { selectRouteParams } from '../../../store/router.selectors';
import { TrackerModel } from '../../models/tracker.model';

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

export const selectTrackersByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllTrackers, (trackers: TrackerModel[]) =>
    trackers.filter((tracker) => tracker.projectId === Number(props.projectId))
  );
