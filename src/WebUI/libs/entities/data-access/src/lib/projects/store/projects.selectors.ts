import { PROJECTS_FEATURE_KEY, projectsAdapter, ProjectsState } from './projects.reducer'
import { ProjectModel } from '@entities/shared'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectProjectsState = createFeatureSelector<ProjectsState>(PROJECTS_FEATURE_KEY)

const { selectAll, selectEntities } = projectsAdapter.getSelectors()

export const selectAllProjects = createSelector(selectProjectsState, (state: ProjectsState) =>
	selectAll(state),
)

export const selectProjectsEntities = createSelector(selectProjectsState, (state: ProjectsState) =>
	selectEntities(state),
)

export const selectProjectById = (props: { id: string }) =>
	createSelector(selectProjectsEntities, (projects: Dictionary<ProjectModel>) => projects[props.id])

export const selectProjectByIdV2 = (props: { id: string }) =>
	createSelector(selectAllProjects, (projects: ProjectModel[]) =>
		projects.find((p) => p.id === props.id),
	)

export const selectSelectedProjectId = createSelector(
	selectProjectsState,
	(state: ProjectsState) => state.selectedProjectId,
)

export const selectSelectedProject = createSelector(
	selectProjectsEntities,
	selectSelectedProjectId,
	(projects: Dictionary<ProjectModel>, selectedProjectId: string | undefined) =>
		selectedProjectId ? projects[selectedProjectId] : undefined,
)

export const selectProjectsByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllProjects, (projects: ProjectModel[]) =>
		projects.filter((project) => props.ids.includes(project.id)),
	)
