import { inject, Injectable } from '@angular/core'
import { HubConnectionRequest } from '@app/data-access/signalr'
import { HubConnection, ILogger, LogLevel } from '@microsoft/signalr'
import {
	AcceptInviteToProjectResponse,
	AcceptProjectInviteRequest,
	CreateProjectRequest,
	GetManyProjectsResponse,
	GetProjectDataResponse,
	InvitedToProjectResponse,
	InviteToProjectRequest,
	KickedFromProjectResponse,
	KickProjectMemberRequest,
	LeaveProjectRequest,
	LeftProjectResponse,
	ProjectCreatedResponse,
	ProjectDeletedResponse,
	ProjectId,
	ProjectMemberKickedResponse,
	ProjectMemberUpdatedResponse,
	ProjectModel,
	PROJECTS_SIGNALR_EVENT,
	PROJECTS_SIGNALR_METHOD,
	ProjectSignalrEvent,
	ProjectUpdatedResponse,
	ReceiveUserMousePositionResponse,
	RejectInviteToProjectResponse,
	RejectProjectInviteRequest,
	SendMousePositionRequest,
	SignalrEventRequest,
	SignalrEventResponse,
	UpdateProjectMemberRequest,
	UserLeftProjectResponse,
	UsersSentInviteToProjectResponse,
} from '@entities/shared'
import { injectProjectsStore } from '../store'
import { EntityUpdate } from '@shared/data-access/models'
import { injectSignalrEventsStore } from '../../signalr-events'
import { UpdateStr } from '@ngrx/entity/src/models'
import { injectEntityStore } from '../../shared'
import { newGuid, retryCheck } from '@shared/utils'
import { injectAuthStore } from '@auth/data-access'
import { createHubConnection } from '@app/signalr'
import { ApplicationInsightsService } from '@app/logging'
import { injectUserPointsStore } from '../../points'

const hubName = 'Projects'
const hubUrl = '/hubs/projects'
// const invoke = 'GetUserProjects'

export type ProjectsHubConnection = HubConnection

export class MyLogger implements ILogger {
	log(logLevel: LogLevel, message: string) {
		// Use `message` and `logLevel` to record the log message to your own system
		console.log(logLevel, message)
		if (logLevel === LogLevel.Error) {
			console.error(logLevel, message)
			if (message.includes('Not Authenticated')) {
				throw new Error(message)
				// retryCheck(() => {
				// 	console.log('retrying')
				// 	this.hubConnection?.start()
				// })
			}
		}
	}
}

@Injectable({
	providedIn: 'root',
})
export class ProjectsSignalrService implements ILogger {
	private _projectsStore = injectProjectsStore()
	private _entitiesStore = injectEntityStore()
	private _signalrEventsStore = injectSignalrEventsStore()
	private _insightsService = inject(ApplicationInsightsService)
	private _authStore = injectAuthStore()
	private _userPointsStore = injectUserPointsStore()

	user = this._authStore.select.user

	hubConnection: ProjectsHubConnection | undefined

	log(logLevel: LogLevel, message: string) {
		if (logLevel === LogLevel.Trace) return
		const hubStart = '[ProjectsHubConnection]'
		if (logLevel === LogLevel.Error) {
			console.error(hubStart, message)
			if (message.includes('Not Authenticated')) {
				this._authStore.dispatch.signOut()
			}
			this._insightsService.logException(new Error(message))
			return
		}
		console.log(hubStart, message)
	}

	init(token: string) {
		const request: HubConnectionRequest = {
			token,
			hubName,
			hubUrl,
		}
		this.hubConnection = createHubConnection(request, this)

		this.onHub(PROJECTS_SIGNALR_EVENT.GET_MANY_PROJECTS, (response: GetManyProjectsResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.GET_MANY_PROJECTS, response)
			this._projectsStore.dispatch.loadUserProjectsSuccess(
				response.projects,
				response.selectedProjectId,
			)
		})

		this.onHub(PROJECTS_SIGNALR_EVENT.PROJECT_CREATED, (response: ProjectCreatedResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.PROJECT_CREATED, response)
		})

		this.onHub(PROJECTS_SIGNALR_EVENT.PROJECT_UPDATED, (response: ProjectUpdatedResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.PROJECT_UPDATED, response)
			const changes: Partial<ProjectModel> = {}
			if (response.changes.name) {
				changes.name = response.changes.name
			}
			if (response.changes.colour) {
				changes.colour = response.changes.colour
			}
			this._projectsStore.dispatch.updateProjectNoSignalr({
				id: response.projectId,
				changes,
			})
		})

		this.onHub(PROJECTS_SIGNALR_EVENT.PROJECT_DELETED, (response: ProjectDeletedResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.PROJECT_DELETED, response)
			this._projectsStore.dispatch.deleteProjectNoSignalr(response.projectId)
		})

		this.onHub(PROJECTS_SIGNALR_EVENT.RECEIVE_PROJECT_EVENT, (response: SignalrEventResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.RECEIVE_PROJECT_EVENT, response)
			this.receiveProjectEvent(response)
		})

		this.onHub(PROJECTS_SIGNALR_EVENT.GET_PROJECT, (response: GetProjectDataResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.GET_PROJECT, response)
			this._entitiesStore.panels.dispatch.loadPanels(response.panels)
			this._entitiesStore.strings.dispatch.loadStrings(response.strings)
			this._entitiesStore.panelConfigs.dispatch.loadPanelConfigs(response.panelConfigs)
			this._entitiesStore.panelLinks.dispatch.loadPanelLinks(response.panelLinks)
		})

		this.onHub(PROJECTS_SIGNALR_EVENT.INVITED_TO_PROJECT, (response: InvitedToProjectResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.INVITED_TO_PROJECT, response)
			this._projectsStore.dispatch.addProject(response.project)
			// Auto select the project when accepting invite
			this._projectsStore.dispatch.selectProject(response.project.id)
		})

		this.onHub(
			PROJECTS_SIGNALR_EVENT.USERS_SENT_INVITE_TO_PROJECT,
			(response: UsersSentInviteToProjectResponse) => {
				console.log(PROJECTS_SIGNALR_EVENT.USERS_SENT_INVITE_TO_PROJECT, response)
			},
		)

		this.onHub(
			PROJECTS_SIGNALR_EVENT.USER_ACCEPTED_INVITE_TO_PROJECT,
			(response: AcceptInviteToProjectResponse) => {
				console.log(PROJECTS_SIGNALR_EVENT.USER_ACCEPTED_INVITE_TO_PROJECT, response)
				this._projectsStore.dispatch.userAcceptedInviteToProject(response)
			},
		)

		this.onHub(
			PROJECTS_SIGNALR_EVENT.USER_REJECTED_INVITE_TO_PROJECT,
			(response: RejectInviteToProjectResponse) => {
				console.log(PROJECTS_SIGNALR_EVENT.USER_REJECTED_INVITE_TO_PROJECT, response)
			},
		)

		this.onHub(PROJECTS_SIGNALR_EVENT.USER_LEFT_PROJECT, (response: UserLeftProjectResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.USER_LEFT_PROJECT, response)
			this._projectsStore.dispatch.userLeftProject(response)
		})

		this.onHub(PROJECTS_SIGNALR_EVENT.LEFT_PROJECT, (response: LeftProjectResponse) => {
			console.log(PROJECTS_SIGNALR_EVENT.LEFT_PROJECT, response)
			this._projectsStore.dispatch.deleteProjectNoSignalr(response.projectId)
		})

		this.onHub(
			PROJECTS_SIGNALR_EVENT.PROJECT_MEMBER_UPDATED,
			(response: ProjectMemberUpdatedResponse) => {
				console.log(PROJECTS_SIGNALR_EVENT.PROJECT_MEMBER_UPDATED, response)
				this._projectsStore.dispatch.updateProjectMemberNoSignalr(response)
			},
		)

		this.onHub(
			PROJECTS_SIGNALR_EVENT.PROJECT_MEMBER_KICKED,
			(response: ProjectMemberKickedResponse) => {
				console.log(PROJECTS_SIGNALR_EVENT.PROJECT_MEMBER_KICKED, response)
				this._projectsStore.dispatch.projectMemberKicked(response)
			},
		)

		this.onHub(
			PROJECTS_SIGNALR_EVENT.KICKED_FROM_PROJECT,
			(response: KickedFromProjectResponse) => {
				console.log(PROJECTS_SIGNALR_EVENT.KICKED_FROM_PROJECT, response)
				this._projectsStore.dispatch.deleteProjectNoSignalr(response.projectId)
			},
		)

		this.onHub(
			PROJECTS_SIGNALR_EVENT.RECEIVE_USER_MOUSE_POSITION,
			(response: ReceiveUserMousePositionResponse) => {
				const selectedProjectId = this._projectsStore.select.selectedProjectId()
				if (selectedProjectId !== response.projectId) {
					return
				}
				console.log(PROJECTS_SIGNALR_EVENT.RECEIVE_USER_MOUSE_POSITION, response)
				this._userPointsStore.dispatch.addPoint({
					id: newGuid(),
					userId: response.userId,
					x: response.x,
					y: response.y,
					time: new Date().getTime(),
				})
			},
		)

		return this.hubConnection
	}

	createProject(request: CreateProjectRequest) {
		console.log(PROJECTS_SIGNALR_METHOD.CREATE_PROJECT, request)
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.CREATE_PROJECT, request)
	}

	getProjectById(projectId: ProjectId, initial?: boolean) {
		if (initial) {
			retryCheck(async () => this.hubConnection?.state === 'Connected', 1000, 10)
				.then(() => this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.GET_PROJECT_BY_ID, projectId))
				.catch((err) => {
					console.error(err)
					throw err
				})
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

	updateProjectMember(request: UpdateProjectMemberRequest) {
		console.log(PROJECTS_SIGNALR_METHOD.UPDATE_PROJECT_MEMBER, request)
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.UPDATE_PROJECT_MEMBER, request)
	}

	kickProjectMember(request: KickProjectMemberRequest) {
		console.log(PROJECTS_SIGNALR_METHOD.KICK_PROJECT_MEMBER, request)
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.KICK_PROJECT_MEMBER, request)
	}

	leaveProject(request: LeaveProjectRequest) {
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.LEAVE_PROJECT, request)
	}

	inviteUsersToProject(request: InviteToProjectRequest) {
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.INVITE_USERS_TO_PROJECT, request)
	}

	acceptProjectInvite(request: AcceptProjectInviteRequest) {
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.ACCEPT_PROJECT_INVITE, request)
	}

	rejectProjectInvite(request: RejectProjectInviteRequest) {
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.REJECT_PROJECT_INVITE, request)
	}

	deleteProject(projectId: ProjectId) {
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.DELETE_PROJECT, { projectId })
	}

	async invokeSignalrEvent(request: Omit<SignalrEventRequest, 'timeStamp'>) {
		this._signalrEventsStore.dispatch.invokeSignalrEvent(addTimeStamp(request))
		console.log(PROJECTS_SIGNALR_METHOD.SEND_PROJECT_EVENT, request)
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		await this.hubConnection.invoke(PROJECTS_SIGNALR_METHOD.SEND_PROJECT_EVENT, request)
	}

	sendMousePosition(request: SendMousePositionRequest) {
		this.invokeHubConnection(PROJECTS_SIGNALR_METHOD.SEND_MOUSE_POSITION, request)
	}

	private receiveProjectEvent(event: SignalrEventResponse) {
		const selectedProjectId = this._projectsStore.select.selectedProjectId()
		if (selectedProjectId !== event.projectId) {
			console.warn(
				`ProjectId mismatch. Selected project id: ${selectedProjectId}. Event projectId: ${event.projectId}`,
			)
			return
		}

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
		this._insightsService.logEvent('User Dispatched Projects Event', {
			action: event.action,
			model: event.model,
			timeDiff,
		})

		this._insightsService.logMetric('projects.signalr.client-to-client.duration', timeDiff)

		if (event.appending) {
			const appendedUpdate = {
				...event,
				id: `${event.requestId}_appended`,
				timeDiff,
			}
			this._signalrEventsStore.dispatch.addSignalrEvent(appendedUpdate)
			return
		}

		const update: UpdateStr<SignalrEventResponse> = {
			id: event.requestId,
			changes: {
				...event,
				timeDiff,
			},
		}
		this._signalrEventsStore.dispatch.updateSignalrEvent(update)
	}

	private onHub<T extends Record<string, any>>(
		event: ProjectSignalrEvent,
		callback: (response: T) => void,
	) {
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		this.hubConnection.on(event, callback)
	}

	private invokeHubConnection(invoke: string, params?: unknown) {
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		if (this.hubConnection.state !== 'Connected') throw new Error('Hub connection is not connected')

		if (invoke && params) {
			this.hubConnection.invoke(invoke, params).catch((err) => {
				console.error(err, invoke, params)
				throw err
			})
		}
		if (invoke && !params) {
			this.hubConnection.invoke(invoke).catch((err) => {
				console.error(err, invoke)
				throw err
			})
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
