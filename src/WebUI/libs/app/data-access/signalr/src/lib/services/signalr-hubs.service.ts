import { Injectable } from '@angular/core'
import { HubConnection } from '@microsoft/signalr'
import { createHubConnection } from '../utils'
import { injectHubsStore } from '../store'

@Injectable({
	providedIn: 'root',
})
export class SignalrHubsService {
	private _hubsStore = injectHubsStore()

	private _usersHubConnection: HubConnection | undefined
	private _projectsHubConnection: HubConnection | undefined

	get usersHubConnection(): HubConnection | undefined {
		return this._usersHubConnection
	}

	get projectsHubConnection(): HubConnection | undefined {
		return this._projectsHubConnection
	}

	initHubs(token: string) {
		this._usersHubConnection = createHubConnection({
			token,
			hubName: 'Users',
			hubUrl: '/hubs/users',
		})
		if (this.usersHubConnection?.state === 'Connected') {
			this._hubsStore.dispatch.usersHubConnected(this.usersHubConnection)
		}

		this._projectsHubConnection = createHubConnection({
			token,
			hubName: 'Projects',
			hubUrl: '/hubs/projects',
		})
		if (this.projectsHubConnection?.state === 'Connected') {
			this._hubsStore.dispatch.projectsHubConnected(this.projectsHubConnection)
		}
	}
}
