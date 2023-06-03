import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
	CreateProjectRequest,
	DeleteProjectRequest,
	GetUserProjectsResponse,
	InviteToProjectRequest,
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

	createProject(request: CreateProjectRequest) {
		return this._http.post('/projects', request)
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
