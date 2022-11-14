import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './trackers.reducer'
import { selectRouteParams } from '../../../store/router.selectors'
import { TrackerModel } from '../../models/tracker.model'

export const selectTrackersState =
  createFeatureSelector<State.TrackerState>('trackers')

export const selectTrackerEntities = createSelector(
  selectTrackersState,
  State.selectEntities,
)

export const selectAllTrackers = createSelector(
  selectTrackersState,
  State.selectAll,
)

export const selectTrackerByRouteParams = createSelector(
  selectTrackerEntities,
  selectRouteParams,
  (trackers, { trackerId }) => trackers[trackerId],
)

export const selectTrackersByInverterIdRouteParams = createSelector(
  selectAllTrackers,
  selectRouteParams,
  (trackers, { inverterId }) =>
    trackers.filter((tracker) => tracker.inverter_id === Number(inverterId)),
)

export const selectTrackersByProjectIdRouteParams = createSelector(
  selectAllTrackers,
  selectRouteParams,
  (trackers, { projectId }) =>
    trackers.filter((tracker) => tracker.project_id === Number(projectId)),
)

export const selectTrackerById = (props: { id: number }) =>
  createSelector(selectAllTrackers, (trackers: TrackerModel[]) =>
    trackers.find((tracker) => tracker.id === props.id),
  )

export const selectTrackersByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllTrackers, (trackers: TrackerModel[]) =>
    trackers.filter(
      (tracker) => tracker.project_id === Number(props.projectId),
    ),
  )
