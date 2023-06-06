import { Injectable } from '@angular/core'
import { HubConnection } from '@microsoft/signalr'
import { createHubConnection, HubConnectionRequest } from '@app/data-access/signalr'
import { ProjectsHubConnection } from '@entities/data-access'
import { ConnectionModel, CONNECTIONS_SIGNALR_EVENT } from '@auth/shared'

const hubName = 'Connections'
const hubUrl = '/hubs/connections'

@Injectable({
	providedIn: 'root',
})
export class ConnectionsSignalrService {
	hubConnection: HubConnection | undefined

	init(token: string): ProjectsHubConnection {
		const request: HubConnectionRequest = {
			token,
			hubName,
			hubUrl,
		}
		this.hubConnection = createHubConnection(request)

		this.hubConnection.on(
			CONNECTIONS_SIGNALR_EVENT.USER_IS_ONLINE,
			(connection: ConnectionModel) => {
				console.log(CONNECTIONS_SIGNALR_EVENT.USER_IS_ONLINE, connection)
			},
		)

		this.hubConnection.on(
			CONNECTIONS_SIGNALR_EVENT.USER_IS_OFFLINE,
			(connection: ConnectionModel) => {
				console.log(CONNECTIONS_SIGNALR_EVENT.USER_IS_OFFLINE, connection)
			},
		)

		this.hubConnection.on(
			CONNECTIONS_SIGNALR_EVENT.GET_ONLINE_USERS,
			(connections: ConnectionModel[]) => {
				console.log(CONNECTIONS_SIGNALR_EVENT.GET_ONLINE_USERS, connections)
			},
		)

		return this.hubConnection
	}

	private invokeHubConnection(invoke: string, params?: unknown) {
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		if (this.hubConnection.state !== 'Connected') throw new Error('Hub connection is not connected')
		if (invoke && params)
			this.hubConnection.invoke(invoke, params).catch((err) => console.error(err, invoke, params))
		if (invoke && !params) {
			this.hubConnection.invoke(invoke).catch((err) => console.error(err, invoke))
		}
	}
}
