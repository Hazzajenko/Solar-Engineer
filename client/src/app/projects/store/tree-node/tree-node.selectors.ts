import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as State from './tree-node.reducer';

export const selectTreeNodesState =
  createFeatureSelector<State.TreeNodeState>('tree_nodes');

export const selectTreeNodesEntities = createSelector(
  selectTreeNodesState,
  State.selectEntities
);

export const selectAllTreeNodes = createSelector(
  selectTreeNodesState,
  State.selectAll
);

/*
export const selectProjectMemberByRouteParams = createSelector(
  selectTreeNodesEntities,
  selectRouteParams,
  (projectMembers, { projectMemberId }) => projectMembers[projectMemberId]
);

export const selectProjectMembersByProjectIdRouteParams = createSelector(
  selectAllTreeNodes,
  selectRouteParams,
  (projectMembers, { projectId }) =>
    projectMembers.filter(
      (projectMember) => projectMember.projectId === Number(projectId)
    )
);
*/
