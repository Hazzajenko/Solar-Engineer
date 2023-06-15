import {
	CONNECTIONS_FEATURE_KEY,
	connectionsAdapter,
	ConnectionsState,
} from './connections.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppUserConnectionModel } from '@auth/shared'

export const selectConnectionsState =
	createFeatureSelector<ConnectionsState>(CONNECTIONS_FEATURE_KEY)

const { selectAll, selectEntities } = connectionsAdapter.getSelectors()

export const selectAllConnections = createSelector(
	selectConnectionsState,
	(state: ConnectionsState) => selectAll(state),
)

export const selectConnectionsEntities = createSelector(
	selectConnectionsState,
	(state: ConnectionsState) => selectEntities(state),
)

export const selectConnectionById = (props: { id: string }) =>
	createSelector(
		selectConnectionsEntities,
		(connections: Dictionary<AppUserConnectionModel>) => connections[props.id],
	)

export const selectConnectionsByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllConnections, (connections: AppUserConnectionModel[]) =>
		connections.filter((connection) => props.ids.includes(connection.appUserId)),
	)
