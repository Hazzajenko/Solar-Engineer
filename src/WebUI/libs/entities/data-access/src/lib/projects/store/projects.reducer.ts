import { ProjectsActions } from './projects.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ProjectId, ProjectModel } from '@entities/shared'

export const PROJECTS_FEATURE_KEY = 'projects'

export interface ProjectsState extends EntityState<ProjectModel> {
	selectedProjectId: ProjectId | undefined
	panelsReadyToRender: boolean
	stringsReadyToRender: boolean
	// panelLinksReadyToRender: boolean
	loaded: boolean
	error?: string | null
}

export const projectsAdapter: EntityAdapter<ProjectModel> = createEntityAdapter<ProjectModel>({
	selectId: (string) => string.id,
})

export const initialProjectsState: ProjectsState = projectsAdapter.getInitialState({
	selectedProjectId: undefined,
	panelsReadyToRender: false,
	stringsReadyToRender: false,
	loaded: false,
})

const reducer = createReducer(
	initialProjectsState,
	on(ProjectsActions.panelsStoreInitialized, (state) => ({
		...state,
		panelsReadyToRender: true,
	})),
	on(ProjectsActions.stringsStoreInitialized, (state) => ({
		...state,
		stringsReadyToRender: true,
	})),
	on(ProjectsActions.loadUserProjectsSuccess, (state, { projects }) => ({
		...state,
		...projectsAdapter.setAll(projects, state),
		loaded: true,
	})),
	on(ProjectsActions.loadUserProjectsFailure, (state, { error }) => ({
		...state,
		error,
	})),
	on(ProjectsActions.selectProject, (state, { projectId }) => ({
		...state,
		selectedProjectId: projectId,
	})),

	on(ProjectsActions.addProject, (state, { project }) => projectsAdapter.addOne(project, state)),
	on(ProjectsActions.addManyProjects, (state, { projects }) =>
		projectsAdapter.addMany(projects, state),
	),
	on(ProjectsActions.updateProject, (state, { update }) =>
		projectsAdapter.updateOne(update, state),
	),
	on(ProjectsActions.updateManyProjects, (state, { updates }) =>
		projectsAdapter.updateMany(updates, state),
	),
	on(ProjectsActions.deleteProject, (state, { projectId }) =>
		projectsAdapter.removeOne(projectId, state),
	),
	on(ProjectsActions.deleteManyProjects, (state, { projectIds }) =>
		projectsAdapter.removeMany(projectIds, state),
	),
	on(ProjectsActions.clearProjectsState, () => initialProjectsState),
)

export function projectsReducer(state: ProjectsState | undefined, action: Action) {
	return reducer(state, action)
}
