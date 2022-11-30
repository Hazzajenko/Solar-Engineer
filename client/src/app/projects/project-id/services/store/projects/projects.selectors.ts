import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './projects.reducer'
import { selectRouteParams } from '../../../../../store/router.selectors'

export const selectProjectsState =
  createFeatureSelector<State.ProjectState>('projects')

export const selectCurrentProjectId = createSelector(
  selectProjectsState,
  (state) => state.currentProjectId,
)

export const selectProjectEntities = createSelector(
  selectProjectsState,
  State.selectEntities,
)

export const selectAllProjects = createSelector(
  selectProjectsState,
  State.selectAll,
)

export const selectProjectByRouteParams = createSelector(
  selectProjectEntities,
  selectRouteParams,
  (projects, { projectId }) => projects[projectId],
)
