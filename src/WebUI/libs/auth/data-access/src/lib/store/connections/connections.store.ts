import { Store } from '@ngrx/store'
import {
	selectAllConnections,
	selectConnectionById,
	selectConnectionsEntities,
} from './connections.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { ConnectionsActions } from './connections.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { AppUserConnectionModel } from '@auth/shared'

export function injectConnectionsStore(): ConnectionsStore {
	return connectionsStoreInjector()
}

const connectionsStoreInjector = createRootServiceInjector(connectionsStoreFactory, {
	deps: [Store],
})

export type ConnectionsStore = ReturnType<typeof connectionsStoreFactory>

function connectionsStoreFactory(store: Store) {
	const allConnections = store.selectSignal(selectAllConnections)
	const entities = store.selectSignal(selectConnectionsEntities)

	const select = {
		allConnections,
		getById: (id: string) => store.selectSignal(selectConnectionById({ id })),
		getByIdOrUndefined: (appUserId: AppUserConnectionModel['appUserId'] | undefined) =>
			appUserId ? entities()[appUserId] : undefined,
		getByIds: (appUserIds: AppUserConnectionModel['appUserId'][]) =>
			appUserIds.map((id) => entities()[id]).filter(isNotNull),
	}
	const dispatch = {
		loadConnections: (connections: AppUserConnectionModel[]) =>
			store.dispatch(ConnectionsActions.loadConnections({ connections })),
		addConnection: (connection: AppUserConnectionModel) =>
			store.dispatch(ConnectionsActions.addConnection({ connection })),
		addManyConnections: (connections: AppUserConnectionModel[]) =>
			store.dispatch(ConnectionsActions.addManyConnections({ connections })),
		updateConnection: (update: UpdateStr<AppUserConnectionModel>) =>
			store.dispatch(ConnectionsActions.updateConnection({ update })),
		updateManyConnections: (updates: UpdateStr<AppUserConnectionModel>[]) =>
			store.dispatch(ConnectionsActions.updateManyConnections({ updates })),
		deleteConnection: (appUserId: AppUserConnectionModel['appUserId']) =>
			store.dispatch(ConnectionsActions.deleteConnection({ appUserId })),
		clearConnectionsState: () => store.dispatch(ConnectionsActions.clearConnectionsState()),
	}

	return {
		select,
		dispatch,
	}
}
