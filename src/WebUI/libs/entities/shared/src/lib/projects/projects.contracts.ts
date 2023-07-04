import { ProjectId, ProjectModel, ProjectUserModel } from './project.model'
import { ProjectDataModel } from './project-data.model'

/**
 * * Requests
 */

export type CreateProjectRequest = {
	name: string
	colour: string
	memberIds: string[]
	templateType: ProjectTemplateType
}

export const PROJECT_TEMPLATE_TYPE = {
	BLANK: 'Blank',
	TWELVE_ROWS_NO_STRINGS: 'TwelveRowsNoStrings',
	TWELVE_ROWS_SIX_STRINGS: 'TwelveRowsSixStrings',
	TWELVE_ROWS_SIX_STRINGS_WITH_LINKS: 'TwelveRowsSixStringsWithLinks',
} as const

export type ProjectTemplateType = (typeof PROJECT_TEMPLATE_TYPE)[keyof typeof PROJECT_TEMPLATE_TYPE]

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

export type LeaveProjectRequest = {
	projectId: ProjectId
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

export type UpdateProjectMemberRequest = {
	projectId: ProjectId
	memberId: string
	changes: Partial<{
		role: string
		canCreate: boolean
		canDelete: boolean
		canInvite: boolean
		canKick: boolean
	}>
}

export type KickProjectMemberRequest = {
	projectId: ProjectId
	memberId: string
}

/**
 * * Responses
 */

export type GetUserProjectsResponse = {
	projects: ProjectModel[]
}

export type GetManyProjectsResponse = {
	projects: ProjectModel[]
	selectedProjectId: ProjectId | undefined
}

export type UsersSentInviteToProjectResponse = {
	projectId: ProjectId
	invitedByUserId: string
	invitedUserIds: string[]
}

// export type ProjectCreatedResponse = {
// 	project: ProjectModel
// }
export type ProjectCreatedResponse = {
	project: ProjectDataModel
}

export type GetProjectByIdResponse = {
	project: ProjectDataModel
}

export type InvitedToProjectResponse = {
	project: ProjectModel
}

export type AcceptInviteToProjectResponse = {
	projectId: ProjectId
	member: ProjectUserModel
}

export type RejectInviteToProjectResponse = {
	projectId: ProjectId
	userId: string
}

export type ProjectUpdatedResponse = {
	projectId: ProjectId
	changes: Partial<ProjectModel>
}

export type UserLeftProjectResponse = {
	projectId: ProjectId
	userId: string
}

export type UserKickedFromProjectResponse = {
	projectId: ProjectId
	userId: string
}

export type LeftProjectResponse = {
	projectId: ProjectId
}

export type ProjectDeletedResponse = {
	projectId: ProjectId
}

export type KickedFromProjectResponse = {
	projectId: ProjectId
}

export type ProjectMemberKickedResponse = {
	projectId: ProjectId
	memberId: string
}

export type ProjectMemberUpdatedResponse = {
	projectId: ProjectId
	memberId: string
	changes: Partial<ProjectUserModel>
}
