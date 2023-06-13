import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
	CreateProjectRequest,
	InviteToProjectRequest,
	ProjectId,
	ProjectModel,
} from '@entities/shared'
import { ProjectEntityStore } from './projects.reducer'
import { EntityUpdate } from '@shared/data-access/models'

export const ProjectsActions = createActionGroup({
	source: 'Projects Store',
	events: {
		'Project Entity Store Initialized': props<{
			store: ProjectEntityStore
		}>(),
		'Project Entity Store Cleared': props<{
			store: ProjectEntityStore
		}>(),
		'Create Project Signalr': props<CreateProjectRequest>(),
		'Select Project': props<{
			projectId: ProjectId
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
		'Accept Project Invite': props<{
			projectId: ProjectId
		}>(),
		'Reject Project Invite': props<{
			projectId: ProjectId
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
		'Update Many Projects': props<{
			updates: UpdateStr<ProjectModel>[]
		}>(),
		'Delete Project': props<{
			projectId: ProjectId
		}>(),
		'Delete Many Projects': props<{
			projectIds: ProjectId[]
		}>(),
		'Clear Projects State': emptyProps(),
	},
})
