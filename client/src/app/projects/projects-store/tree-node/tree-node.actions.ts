import { createAction, props } from '@ngrx/store';
import { ProjectNode } from '../../services/tree-nodes.service';

export const addTreeNode = createAction(
  '[TreeNode Service] Add TreeNode',
  props<{ treeNode: ProjectNode }>()
);

export const addTreeNodes = createAction(
  '[TreeNode Service] Add TreeNodes',
  props<{ treeNodes: ProjectNode[] }>()
);
