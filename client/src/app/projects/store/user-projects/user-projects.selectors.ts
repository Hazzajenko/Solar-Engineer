import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as State from './user-projects.reducer';
import { selectRouteParams } from '../../../store/router.selectors';

export const selectUserProjectsState =
  createFeatureSelector<State.UserProjectState>('projectMembers');

export const selectProjectMemberEntities = createSelector(
  selectUserProjectsState,
  State.selectEntities
);

export const selectAllProjectMembers = createSelector(
  selectUserProjectsState,
  State.selectAll
);

export const selectProjectMemberByRouteParams = createSelector(
  selectProjectMemberEntities,
  selectRouteParams,
  (projectMembers, { projectMemberId }) => projectMembers[projectMemberId]
);

export const selectProjectMembersByProjectIdRouteParams = createSelector(
  selectAllProjectMembers,
  selectRouteParams,
  (projectMembers, { projectId }) =>
    projectMembers.filter(
      (projectMember) => projectMember.projectId === Number(projectId)
    )
);
