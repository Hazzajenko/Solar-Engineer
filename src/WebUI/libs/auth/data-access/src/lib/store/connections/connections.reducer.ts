import { ConnectionsActions } from './connections.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { AppUserConnectionModel } from '@auth/shared'

export const CONNECTIONS_FEATURE_KEY = 'connections'

export interface ConnectionsState extends EntityState<AppUserConnectionModel> {
	currentAppConnectionId: string | undefined
	loaded: boolean
	error?: string | null
}

export const connectionsAdapter: EntityAdapter<AppUserConnectionModel> =
	createEntityAdapter<AppUserConnectionModel>({
		selectId: (string) => string.appUserId,
	})

export const initialConnectionsState: ConnectionsState = connectionsAdapter.getInitialState({
	currentAppConnectionId: undefined,
	loaded: false,
	isSearching: false,
	connectionSearchResults: [],
})

const reducer = createReducer(
	initialConnectionsState,
	on(ConnectionsActions.loadConnections, (state, { connections }) =>
		connectionsAdapter.setAll(connections, { ...state, loaded: true }),
	),
	on(ConnectionsActions.addConnection, (state, { connection }) =>
		connectionsAdapter.addOne(connection, state),
	),
	on(ConnectionsActions.addManyConnections, (state, { connections }) =>
		connectionsAdapter.addMany(connections, state),
	),
	on(ConnectionsActions.updateConnection, (state, { update }) =>
		connectionsAdapter.updateOne(update, state),
	),
	on(ConnectionsActions.updateManyConnections, (state, { updates }) =>
		connectionsAdapter.updateMany(updates, state),
	),
	on(ConnectionsActions.deleteConnection, (state, { appUserId }) =>
		connectionsAdapter.removeOne(appUserId, state),
	),
	on(ConnectionsActions.clearConnectionsState, () => initialConnectionsState),
)

export function connectionsReducer(state: ConnectionsState | undefined, action: Action) {
	return reducer(state, action)
}
