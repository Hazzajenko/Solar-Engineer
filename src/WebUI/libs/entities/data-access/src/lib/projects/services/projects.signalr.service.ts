import { Injectable } from '@angular/core'
import { createHubConnection, HubConnectionRequest } from '@app/data-access/signalr'
import { HubConnection } from '@microsoft/signalr'
import { ProjectId, ProjectModel, PROJECTS_SIGNALR_EVENT } from '@entities/shared'
import { injectProjectsStore } from '../store'
import { EntityUpdate } from '@shared/data-access/models'

const hubName = 'Projects'
const hubUrl = '/hubs/projects'
const invoke = 'GetUserProjects'

@Injectable({
	providedIn: 'root',
})
export class ProjectsSignalrService {
	private _projectsStore = injectProjectsStore()
	hubConnection: HubConnection | undefined

	init(token: string) {
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
