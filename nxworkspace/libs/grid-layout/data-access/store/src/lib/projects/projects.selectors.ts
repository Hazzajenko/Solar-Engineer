import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './projects.reducer'
import { selectRouteParams } from '@shared/data-access/store'

export const selectProjectsState = createFeatureSelector<State.ProjectState>('projects')



export const selectProjectEntities = createSelector(selectProjectsState, State.selectEntities)
export const selectCurrentProjectId = createSelector(
  /*  selectProjectsState,
    (state) => state.currentProjectId,*/
  selectProjectEntities,
  selectRouteParams,
  (projects, { projectId }) => projects[projectId]!.id,
)

export const selectAllProjects = createSelector(selectProjectsState, State.projectAdapter.getSelectors().selectAll)

export const selectProjectByRouteParams = createSelector(
  selectProjectEntities,
  selectRouteParams,
  (projects, { projectId }) => projects[projectId],
)

export const selectProjectIdByRouteParams = createSelector(
  selectProjectEntities,
  selectRouteParams,
  (projects, { projectId }) => projects[projectId]?.id,
)
