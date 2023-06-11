import { Injectable } from '@angular/core'
import { HubConnection } from '@microsoft/signalr'
import { createHubConnection } from '../utils'

@Injectable({
	providedIn: 'root',
})
export class SignalrHubsService {
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
		this._projectsHubConnection = createHubConnection({
			token,
			hubName: 'Projects',
			hubUrl: '/hubs/projects',
		})
	}
}
