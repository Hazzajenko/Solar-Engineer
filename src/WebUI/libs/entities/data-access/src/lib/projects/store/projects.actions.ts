import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
	AcceptInviteToProjectResponse,
	AcceptProjectInviteRequest,
	CreateProjectRequest,
	InviteToProjectRequest,
	KickProjectMemberRequest,
	ProjectId,
	ProjectLocalStorageModel,
	ProjectMemberKickedResponse,
	ProjectMemberUpdatedResponse,
	ProjectModel,
	RejectProjectInviteRequest,
	UpdateProjectMemberRequest,
	UserLeftProjectResponse,
} from '@entities/shared'
import { ProjectEntityStore } from './projects.reducer'
import { EntityUpdate } from '@shared/data-access/models'

export const ProjectsActions = createActionGroup({
	source: 'Projects Store',
	events: {
		'Init Local Storage Project': props<{
			localStorageProject: ProjectLocalStorageModel
		}>(),
		'Project Entity Store Initialized': props<{
			store: ProjectEntityStore
		}>(),
		'Project Entity Store Cleared': props<{
			store: ProjectEntityStore
		}>(),
		'Create Project Signalr': props<{
			request: CreateProjectRequest
		}>(),
		'Select Project': props<{
			projectId: ProjectId
		}>(),
		'Get Project Failure': props<{
			error: string | null
		}>(),
		'Select Project Initial': props<{
			projectId: ProjectId
		}>(),
		'Load User Projects': emptyProps(),
		'Load User Projects Success': props<{
			projects: ProjectModel[]
		}>(),
		'Load User Projects Failure': props<{
			error: string | null
		}>(),
		'User Projects Empty': emptyProps(),
		'Invite Users To Project': props<{
			request: InviteToProjectRequest
		}>(),
		'User Accepted Invite To Project': props<{
			response: AcceptInviteToProjectResponse
		}>(),
		'Accept Project Invite': props<{
			request: AcceptProjectInviteRequest
		}>(),
		'Reject Project Invite': props<{
			request: RejectProjectInviteRequest
		}>(),
		'Update Project Member': props<{
			request: UpdateProjectMemberRequest
		}>(),
		'Update Project Member No Signalr': props<{
			response: ProjectMemberUpdatedResponse
		}>(),
		'Kick Project Member': props<{
			request: KickProjectMemberRequest
		}>(),
		'Project Member Kicked': props<{
			response: ProjectMemberKickedResponse
		}>(),
		'Add Project': props<{
			project: ProjectModel
		}>(),
		'Add Many Projects': props<{
			projects: ProjectModel[]
		}>(),
		'Update Project': props<{
			update: EntityUpdate<ProjectModel>
		}>(),
		'Update Project No Signalr': props<{
			update: EntityUpdate<ProjectModel>
		}>(),
		'Update Many Projects': props<{
			updates: UpdateStr<ProjectModel>[]
		}>(),
		'Delete Project': props<{
			projectId: ProjectId
		}>(),
		'Delete Project No Signalr': props<{
			projectId: ProjectId
		}>(),
		'Delete Many Projects': props<{
			projectIds: ProjectId[]
		}>(),
		'User Left Project': props<{
			response: UserLeftProjectResponse
		}>(),
		'Leave Project': props<{
			projectId: ProjectId
		}>(),
		'Clear Projects State': emptyProps(),
	},
})
