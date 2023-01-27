import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ConnectionModel } from '@shared/data-access/models'

import { ConnectionsActions } from './connections.actions'

export const CONNECTIONS_FEATURE_KEY = 'connections'

export interface ConnectionsState extends EntityState<ConnectionModel> {
  loaded: boolean
  error?: string | null
}

export function selectUsername(a: ConnectionModel): string {
  return a.userName
}

export const connectionsAdapter: EntityAdapter<ConnectionModel> =
  createEntityAdapter<ConnectionModel>({
    selectId: selectUsername,
  })

export const initialStringsState: ConnectionsState = connectionsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialStringsState,
  on(ConnectionsActions.initConnections, (state) => ({ ...state, loaded: false, error: null })),
  on(ConnectionsActions.addConnection, (state, { connection }) =>
    connectionsAdapter.addOne(connection, state),
  ),
  on(ConnectionsActions.addManyConnections, (state, { connections }) =>
    connectionsAdapter.addMany(connections, state),
  ),
  on(ConnectionsActions.removeConnection, (state, { connection }) =>
    connectionsAdapter.removeOne(connection.userName, state),
  ),
  on(ConnectionsActions.clearConnectionsState, (state) => connectionsAdapter.removeAll(state)),
)

export function connectionsReducer(state: ConnectionsState | undefined, action: Action) {
  return reducer(state, action)
}
