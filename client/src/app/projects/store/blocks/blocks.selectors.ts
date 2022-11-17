import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './blocks.reducer'
import { selectRouteParams } from '../../../store/router.selectors'
import { BlockModel } from '../../models/block.model'

export const selectBlocksState =
  createFeatureSelector<State.BlocksState>('blocks')

export const selectBlocksEntities = createSelector(
  selectBlocksState,
  State.selectEntities,
)

export const selectAllBlocks = createSelector(
  selectBlocksState,
  State.selectAll,
)

export const selectBlocksByProjectIdRouteParams = createSelector(
  selectAllBlocks,
  selectRouteParams,
  (panels, { projectId }) =>
    panels.filter((panel) => panel.project_id === Number(projectId)),
)

export const selectBlocksByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.filter((block) => block.project_id === Number(props.projectId)),
  )
