import { createFeatureSelector, createSelector } from '@ngrx/store'
import { RouterSelectors } from '@shared/data-access/router'
import { PROJECTS_FEATURE_KEY, projectsAdapter, ProjectsState } from './projects.reducer'

export const selectProjectsState = createFeatureSelector<ProjectsState>(PROJECTS_FEATURE_KEY)

const { selectAll, selectEntities } = projectsAdapter.getSelectors()

export const selectProjectsLoaded = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.loaded,
)

export const selectProjectsError = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.error,
)

export const selectAllProjects = createSelector(selectProjectsState, (state: ProjectsState) =>
  selectAll(state),
)

export const selectProjectsEntities = createSelector(selectProjectsState, (state: ProjectsState) =>
  selectEntities(state),
)

export const selectSelectedId = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.selectedId,
)

export const selectSelectedProjectId = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.selectedProjectId,
)

export const selectIsWebProject = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.web,
)

export const selectEntity = createSelector(
  selectProjectsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
)

/* export const selectProjectByRouteParams = createSelector(
  selectProjectsEntities,
  selectRouteParams,
  (projects, { projectId }) => projects[projectId],
) */

/* export const selectProjectByRouteParams = createSelector(
  selectProjectsEntities,
  selectRouteParams,
  (projects, { projectId }) => {
    if (projectId === 'local') {
      return selectLocalProject
    }
    return projects[projectId]
  },
) */

export const selectProjectByRouteParams = createSelector(
  selectProjectsState,
  selectAllProjects,
  RouterSelectors.selectRouteParams,
  (state, projects, { projectName }) => {
    console.log('selectProjectByRouteParams', projectName)
    if (!projectName) {
      return state.localProject
    }
    return projects.find((project) => project.name === projectName)
  },
)

export const selectProjectByNameRouteParams = createSelector(
  selectProjectsState,
  selectAllProjects,
  RouterSelectors.selectRouteParams,
  (state, projects, { projectName }) => {
    console.log('selectProjectByRouteParams', projectName)
    if (!projectName) {
      return state.localProject
    }
    return projects.find((project) => project.name === projectName)
  },
)

export const selectProjectIdByRouteParams = createSelector(
  selectProjectsState,
  selectProjectsEntities,
  RouterSelectors.selectRouteParams,
  (state, projects, { projectId }) => {
    console.log('selectProjectByRouteParams', projectId)
    if (!projectId) {
      return state.localProject?.id
    }
    return projects[projectId]?.id
  },
)

export const selectLocalProjectId = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.localProjectId,
)

export const selectLocalProject = createSelector(
  selectAllProjects,
  selectLocalProjectId,
  (projects, localProjectId) => projects.find((project) => project.id === localProjectId),
)
