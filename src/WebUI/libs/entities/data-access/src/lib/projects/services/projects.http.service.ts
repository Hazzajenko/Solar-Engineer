import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
	CreateProjectRequest,
	DeleteProjectRequest,
	GetProjectByIdResponse,
	GetUserProjectsResponse,
	InviteToProjectRequest,
	ProjectCreatedResponse,
	UpdateProjectRequest,
} from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class ProjectsHttpService {
	private _http = inject(HttpClient)

	getUserProjects() {
		return this._http.get<GetUserProjectsResponse>('/projects')
	}

	getProjectById(projectId: string) {
		return this._http.get<GetProjectByIdResponse>(`/projects/projects/${projectId}`)
	}

	createProject(request: CreateProjectRequest) {
		return this._http.post<ProjectCreatedResponse>('/projects', request)
	}

	updateProject(request: UpdateProjectRequest) {
		return this._http.put('/projects', request)
	}

	deleteProject(request: DeleteProjectRequest) {
		return this._http.delete(`/projects/${request.projectId}`)
	}

	inviteToProject(request: InviteToProjectRequest) {
		return this._http.post(`/projects/${request.projectId}/members`, request)
	}
}
