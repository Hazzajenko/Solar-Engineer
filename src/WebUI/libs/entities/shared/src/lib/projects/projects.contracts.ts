import { ProjectId, ProjectModel } from './project.model'

/**
 * * Requests
 */

export type CreateProjectRequest = {
	name: string
	colour: string
	memberIds: string[]
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

export type AcceptProjectInviteRequest = {
	projectId: ProjectId
	notificationId: string
}

export type RejectProjectInviteRequest = {
	projectId: ProjectId
	notificationId: string
}

/**
 * * Responses
 */

export type GetUserProjectsResponse = {
	projects: ProjectModel[]
}

export type GetManyProjectsResponse = {
	projects: ProjectModel[]
}

export type UsersSentInviteToProjectResponse = {
	projectId: ProjectId
	invitedByUserId: string
	invitedUserIds: string[]
}

export type ProjectCreatedResponse = {
	project: ProjectModel
}

export type InvitedToProjectResponse = {
	project: ProjectModel
}

export type AcceptInviteToProjectResponse = {
	projectId: ProjectId
	userId: string
}

export type RejectInviteToProjectResponse = {
	projectId: ProjectId
	userId: string
}

export type ProjectUpdatedResponse = {
	projectId: ProjectId
	changes: Partial<ProjectModel>
}

export type ProjectDeletedResponse = {
	projectId: ProjectId
}
