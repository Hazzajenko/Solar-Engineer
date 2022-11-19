import { TrackerModel } from '../../models/tracker.model'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import * as TrackerActions from './trackers.actions'

export const selectTrackerId = (b: TrackerModel): string => b.id
export const sortByTrackerName = (a: TrackerModel, b: TrackerModel): number =>
  a.name.localeCompare(b.name)

export const trackerAdapter: EntityAdapter<TrackerModel> =
  createEntityAdapter<TrackerModel>({
    selectId: selectTrackerId,
    sortComparer: sortByTrackerName,
  })

export const initialTrackersState = trackerAdapter.getInitialState({})

export const trackersReducer = createReducer(
  initialTrackersState,

  on(TrackerActions.addTracker, (state, { tracker }) =>
    trackerAdapter.addOne(tracker, state),
  ),

  on(TrackerActions.addTrackers, (state, { trackers }) =>
    trackerAdapter.addMany(trackers, state),
  ),

  on(TrackerActions.updateTracker, (state, { tracker }) =>
    trackerAdapter.updateOne(
      {
        id: tracker.id,
        changes: tracker,
      },
      state,
    ),
  ),

  on(TrackerActions.deleteTracker, (state, { trackerId }) =>
    trackerAdapter.removeOne(trackerId, state),
  ),
)

export const { selectIds, selectEntities, selectAll } =
  trackerAdapter.getSelectors()

export type TrackerState = EntityState<TrackerModel>
