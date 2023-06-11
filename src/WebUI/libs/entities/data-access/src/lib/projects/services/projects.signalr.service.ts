import { inject, Injectable } from '@angular/core'
import { SignalrHubsService } from '@app/data-access/signalr'
import { HubConnection } from '@microsoft/signalr'
import {
	CreateProjectRequest,
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
import { injectAuthStore } from '@auth/data-access'

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
	private _authStore = injectAuthStore()
	private _signalrHubs = inject(SignalrHubsService)

	user = this._authStore.select.user

	// hubConnection: ProjectsHubConnection | undefined
	get hubConnection() {
		return this._signalrHubs.projectsHubConnection
	}

	init() {
		if (!this.hubConnection) {
			throw new Error('ProjectsSignalrService: hubConnection is undefined')
		}
		// const request: HubConnectionRequest = {
		// 	token,
		// 	hubName,
		// 	hubUrl,
		// }
		// this.hubConnection = createHubConnection(request)

		// if (this.hubConnection.state === 'Connected') {
		// 	this.invokeHubConnection(invoke)
		// }

		this.hubConnection.on(PROJECTS_SIGNALR_EVENT.GET_MANY_PROJECTS, (projects: ProjectModel[]) => {
			console.log(PROJECTS_SIGNALR_EVENT.GET_MANY_PROJECTS, projects)
			this._projectsStore.dispatch.loadUserProjectsSuccess(projects)
		})

		this.hubConnection.on(PROJECTS_SIGNALR_EVENT.PROJECT_CREATED, (project: ProjectModel) => {
			console.log(PROJECTS_SIGNALR_EVENT.PROJECT_CREATED, project)
			this._projectsStore.dispatch.addProject(project)
			this._projectsStore.dispatch.selectProject(project.id)
		})

		this.hubConnection.on(
			PROJECTS_SIGNALR_EVENT.PROJECT_UPDATED,
			(response: EntityUpdate<ProjectModel>) => {
				console.log(PROJECTS_SIGNALR_EVENT.PROJECT_UPDATED, response)
			},
		)

		this.hubConnection.on(
			PROJECTS_SIGNALR_EVENT.PROJECT_DELETED,
			(response: { projectId: ProjectId }) => {
				console.log(PROJECTS_SIGNALR_EVENT.PROJECT_DELETED, response)
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
			this._entitiesStore.panels.dispatch.loadPanels(response.panels)
			this._entitiesStore.strings.dispatch.loadStrings(response.strings)
			// this._entitiesStore.panelLinks.addManyPanelLinks(response.panelLinks)
			this._entitiesStore.panelConfigs.dispatch.loadPanelConfigs(response.panelConfigs)
			// this._entitiesStore.panelLinks.addManyPanelLinks(response.panelLinks)
		})

		return this.hubConnection
	}

	createProject(request: CreateProjectRequest) {
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.CREATE_PROJECT, request)
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

	updateProject(update: EntityUpdate<ProjectModel>) {
		console.log(PROJECTS_SIGNALR_METHOD.UPDATE_PROJECT, update)
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.UPDATE_PROJECT, {
			projectId: update.id,
			changes: update.changes,
		})
	}

	deleteProject(projectId: ProjectId) {
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.DELETE_PROJECT, { projectId })
	}

	invokeSignalrEvent(request: Omit<SignalrEventRequest, 'timeStamp'>) {
		this._signalrEventsStore.dispatch.invokeSignalrEvent(addTimeStamp(request))
		console.log(PROJECTS_SIGNALR_METHOD.SEND_PROJECT_EVENT, request)
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
