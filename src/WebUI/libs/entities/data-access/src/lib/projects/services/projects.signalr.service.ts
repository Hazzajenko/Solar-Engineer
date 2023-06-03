import { Injectable } from '@angular/core'
import { createHubConnection, HubConnectionRequest } from '@app/data-access/signalr'
import { HubConnection } from '@microsoft/signalr'

@Injectable({
	providedIn: 'root',
})
export class ProjectsSignalrService {
	hubConnection: HubConnection | undefined

	init(request: HubConnectionRequest) {
		this.hubConnection = createHubConnection(request)
	}

	private invokeHubConnection(invoke: string, ...params: unknown[]) {
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		if (invoke && params)
			this.hubConnection.invoke(invoke, params).catch((err) => console.error(err, invoke, params))
		if (invoke && !params) {
			this.hubConnection.invoke(invoke).catch((err) => console.error(err, invoke))
		}
	}
}
