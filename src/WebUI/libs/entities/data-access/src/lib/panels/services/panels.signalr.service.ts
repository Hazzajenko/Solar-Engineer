import { Injectable } from '@angular/core'
import {
	CreateManyPanelsRequest,
	CreatePanelRequest,
	DeleteManyPanelsRequest,
	DeletePanelRequest,
	PANELS_SIGNALR_METHOD,
	UpdateManyPanelsRequest,
	UpdatePanelRequest,
} from '@entities/shared'
import { ProjectsHubConnection } from '../../projects'

@Injectable({
	providedIn: 'root',
})
export class PanelsSignalrService {
	hubConnection: ProjectsHubConnection | undefined

	init(hubConnection: ProjectsHubConnection) {
		this.hubConnection = hubConnection
	}

	addPanel(request: CreatePanelRequest) {
		this.invokeHubConnection(PANELS_SIGNALR_METHOD.CREATE_PANEL, request)
	}

	addManyPanels(request: CreateManyPanelsRequest) {
		this.invokeHubConnection(PANELS_SIGNALR_METHOD.CREATE_MANY_PANELS, request)
	}

	updatePanel(request: UpdatePanelRequest) {
		this.invokeHubConnection(PANELS_SIGNALR_METHOD.UPDATE_PANEL, request)
	}

	updateManyPanels(request: UpdateManyPanelsRequest) {
		this.invokeHubConnection(PANELS_SIGNALR_METHOD.UPDATE_MANY_PANELS, request)
	}

	deletePanel(request: DeletePanelRequest) {
		this.invokeHubConnection(PANELS_SIGNALR_METHOD.DELETE_PANEL, request)
	}

	deleteManyPanels(request: DeleteManyPanelsRequest) {
		this.invokeHubConnection(PANELS_SIGNALR_METHOD.DELETE_MANY_PANELS, request)
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
