import { ProjectId, ProjectModel } from './project.model'

/**
 * * Requests
 */

export type CreateProjectRequest = {
	name: string
}

export type UpdateProjectRequest = {
	projectId: ProjectId
	change: Partial<ProjectModel>
}

export type DeleteProjectRequest = {
	projectId: ProjectId
}

export type InviteToProjectRequest = {
	projectId: ProjectId
	invites: ProjectInvite[]
}

export type ProjectInvite = {
	userId: string
	role: string
	canCreate: boolean
	canDelete: boolean
	canInvite: boolean
	canKick: boolean
}

/**
 * * Responses
 */

export type GetUserProjectsResponse = {
	projects: ProjectModel[]
}
