import { Injectable } from '@angular/core'
import { createHubConnection, HubConnectionRequest } from '@app/data-access/signalr'
import { HubConnection } from '@microsoft/signalr'
import {
	ProjectDataModel,
	ProjectId,
	ProjectModel,
	PROJECTS_SIGNALR_EVENT,
	PROJECTS_SIGNALR_METHOD,
	SignalrEventRequest,
	SignalrEventResponse,
} from '@entities/shared'
import { injectProjectsStore } from '../store'
import { EntityUpdate } from '@shared/data-access/models'
import { injectSignalrEventsStore } from '../../signalr-events'
import { UpdateStr } from '@ngrx/entity/src/models'
import { injectEntityStore } from '../../shared'
import { retryCheck } from '@shared/utils'

const hubName = 'Projects'
const hubUrl = '/hubs/projects'
const invoke = 'GetUserProjects'

export type ProjectsHubConnection = HubConnection

@Injectable({
	providedIn: 'root',
})
export class ProjectsSignalrService {
	private _projectsStore = injectProjectsStore()
	private _entitiesStore = injectEntityStore()

	private _signalrEventsStore = injectSignalrEventsStore()
	hubConnection: ProjectsHubConnection | undefined

	init(token: string): ProjectsHubConnection {
		const request: HubConnectionRequest = {
			token,
			hubName,
			hubUrl,
			invoke,
		}
		this.hubConnection = createHubConnection(request)

		if (this.hubConnection.state === 'Connected') {
			this.invokeHubConnection(invoke)
		}

		this.hubConnection.on(PROJECTS_SIGNALR_EVENT.GET_MANY_PROJECTS, (projects: ProjectModel[]) => {
			console.log(PROJECTS_SIGNALR_EVENT.GET_MANY_PROJECTS, projects)
			this._projectsStore.dispatch.addManyProjects(projects)
		})

		this.hubConnection.on(PROJECTS_SIGNALR_EVENT.PROJECT_CREATED, (project: ProjectModel) => {
			console.log(PROJECTS_SIGNALR_EVENT.PROJECT_CREATED, project)
			this._projectsStore.dispatch.addProject(project)
		})

		this.hubConnection.on(
			PROJECTS_SIGNALR_EVENT.PROJECT_UPDATED,
			(response: EntityUpdate<ProjectModel>) => {
				console.log(PROJECTS_SIGNALR_EVENT.PROJECT_UPDATED, response)
				this._projectsStore.dispatch.updateProject(response)
			},
		)

		this.hubConnection.on(
			PROJECTS_SIGNALR_EVENT.PROJECT_DELETED,
			(response: { projectId: ProjectId }) => {
				console.log(PROJECTS_SIGNALR_EVENT.PROJECT_DELETED, response)
				this._projectsStore.dispatch.deleteProject(response.projectId)
			},
		)

		this.hubConnection.on(
			PROJECTS_SIGNALR_EVENT.RECEIVE_PROJECT_EVENT,
			(response: SignalrEventResponse) => {
				console.log(PROJECTS_SIGNALR_EVENT.RECEIVE_PROJECT_EVENT, response)
				this.receiveProjectEvent(response)
			},
		)

		this.hubConnection.on(PROJECTS_SIGNALR_EVENT.GET_PROJECT, (response: ProjectDataModel) => {
			console.log(PROJECTS_SIGNALR_EVENT.GET_PROJECT, response)
			this._entitiesStore.panels.loadPanels(response.panels)
			this._entitiesStore.strings.dispatch.loadStrings(response.strings)
			// this._entitiesStore.panelLinks.addManyPanelLinks(response.panelLinks)
			this._entitiesStore.panelConfigs.loadPanelConfigs(response.panelConfigs)
			// this._entitiesStore.panelLinks.addManyPanelLinks(response.panelLinks)
		})

		return this.hubConnection
	}

	getProjectById(projectId: ProjectId, initial?: boolean) {
		if (initial) {
			retryCheck(async () => this.hubConnection?.state === 'Connected', 1000, 10)
				.then(() => this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.GET_PROJECT_BY_ID, projectId))
				.catch((err) => console.error(err))
			return
		}
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.GET_PROJECT_BY_ID, projectId)
	}

	invokeSignalrEvent(request: Omit<SignalrEventRequest, 'timeStamp'>) {
		this._signalrEventsStore.dispatch.addSignalrEvent(addTimeStamp(request))
		console.log(PROJECTS_SIGNALR_METHOD.SEND_PROJECT_EVENT, request)
		// this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.SEND_PROJECT_EVENT, request)
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		this.hubConnection
			.invoke(PROJECTS_SIGNALR_METHOD.SEND_PROJECT_EVENT, request)
			.catch((err) => console.error(err, invoke, request))
	}

	private receiveProjectEvent(event: SignalrEventResponse) {
		const existingEvent = this._signalrEventsStore.select.getById(event.requestId)
		if (!existingEvent) {
			this._signalrEventsStore.dispatch.addSignalrEvent(event)
			return
		}

		if (!event.isSuccess || event.error) {
			console.error('event is not success', event)
		}

		const timeDiff =
			new Date(event.serverTime).getTime() - new Date(existingEvent.timeStamp).getTime()

		console.log('timeDiff', timeDiff)

		const update: UpdateStr<SignalrEventResponse> = {
			id: event.requestId,
			changes: {
				...event,
				timeDiff,
			},
		}
		this._signalrEventsStore.dispatch.updateSignalrEvent(update)
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

function addTimeStamp<T>(entity: T): T & {
	timeStamp: string
} {
	return {
		...entity,
		timeStamp: new Date().toISOString(),
	}
}
