import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as TreeNodeActions from './tree-node.actions';
import { ProjectNode } from '../../services/treenode.service';

export const selectTreeNodeId = (b: ProjectNode): number => b.id;

export const treeNodeAdapter: EntityAdapter<ProjectNode> =
  createEntityAdapter<ProjectNode>({
    selectId: selectTreeNodeId,
  });

export const initialTreeNodesState = treeNodeAdapter.getInitialState({});

export const treeNodeReducer = createReducer(
  initialTreeNodesState,

  on(TreeNodeActions.addTreeNode, (state, { treeNode }) =>
    treeNodeAdapter.addOne(treeNode, state)
  ),

  on(TreeNodeActions.addTreeNodes, (state, { treeNodes }) =>
    treeNodeAdapter.addMany(treeNodes, state)
  )
);

export const { selectIds, selectEntities, selectAll } =
  treeNodeAdapter.getSelectors();

export type TreeNodeState = EntityState<ProjectNode>;
