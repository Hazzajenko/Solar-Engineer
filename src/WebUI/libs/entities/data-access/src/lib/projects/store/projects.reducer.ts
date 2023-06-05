import { ProjectsActions } from './projects.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ProjectId, ProjectModel } from '@entities/shared'

export const PROJECTS_FEATURE_KEY = 'projects'

export type ProjectEntityStore = 'panels' | 'strings' | 'panelLinks' | 'panelConfigs'
// export const initialStoresArray = ['panels', 'strings', 'panelLinks', 'panelConfigs']
const initialStoresObject = {
	panels: false,
	strings: false,
	panelLinks: false,
	panelConfigs: false,
}

export interface ProjectsState extends EntityState<ProjectModel> {
	selectedProjectId: ProjectId | undefined
	storesToInit: typeof initialStoresObject
	storesToClear: typeof initialStoresObject
	/*	storesToInit: Map<ProjectEntityStore, boolean> | null
	 storesToClear: Map<ProjectEntityStore, boolean> | null*/
	loaded: boolean
	error?: string | null
}

export const projectsAdapter: EntityAdapter<ProjectModel> = createEntityAdapter<ProjectModel>({
	selectId: (string) => string.id,
})

export const initialProjectsState: ProjectsState = projectsAdapter.getInitialState({
	selectedProjectId: undefined,
	storesToInit: initialStoresObject,
	storesToClear: initialStoresObject,
	loaded: false,
})

const reducer = createReducer(
	initialProjectsState,
	on(ProjectsActions.projectEntityStoreInitialized, (state, { store }) => ({
		...state,
		storesToInit: {
			...state.storesToInit,
			[store]: true,
		},
	})),
	on(ProjectsActions.projectEntityStoreCleared, (state, { store }) => ({
		...state,
		storesToClear: {
			...state.storesToClear,
			[store]: true,
		},
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
		storesToInit: initialStoresObject,
		storesToClear: initialStoresObject,
	})),
	on(ProjectsActions.selectProjectInitial, (state, { projectId }) => ({
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
