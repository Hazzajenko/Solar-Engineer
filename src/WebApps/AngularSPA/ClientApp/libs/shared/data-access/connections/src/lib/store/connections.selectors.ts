import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CONNECTIONS_FEATURE_KEY, connectionsAdapter, ConnectionsState } from './connections.reducer'

export const selectConnectionsState = createFeatureSelector<ConnectionsState>(CONNECTIONS_FEATURE_KEY)

const { selectAll, selectEntities } = connectionsAdapter.getSelectors()

export const selectConnectionsLoaded = createSelector(
  selectConnectionsState,
  (state: ConnectionsState) => state.loaded,
)

export const selectConnectionsError = createSelector(
  selectConnectionsState,
  (state: ConnectionsState) => state.error,
)

export const selectAllConnections = createSelector(selectConnectionsState, (state: ConnectionsState) =>
  selectAll(state),
)

export const selectConnectionsEntities = createSelector(selectConnectionsState, (state: ConnectionsState) =>
  selectEntities(state),
)

