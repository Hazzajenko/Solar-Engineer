import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { CreateProjectRequest, ProjectId, ProjectModel } from '@entities/shared'

export const ProjectsActions = createActionGroup({
	source: 'Projects Store',
	events: {
		'Panels Store Initialized': emptyProps(),
		'Strings Store Initialized': emptyProps(),
		'Create Project Http': props<CreateProjectRequest>(),
		'Select Project': props<{
			projectId: ProjectId
		}>(),
		'Load User Projects': emptyProps(),
		'Load User Projects Success': props<{
			projects: ProjectModel[]
		}>(),
		'Load User Projects Failure': props<{
			error: string | null
		}>(),
		'Add Project': props<{
			project: ProjectModel
		}>(),
		'Add Many Projects': props<{
			projects: ProjectModel[]
		}>(),
		'Update Project': props<{
			update: UpdateStr<ProjectModel>
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
