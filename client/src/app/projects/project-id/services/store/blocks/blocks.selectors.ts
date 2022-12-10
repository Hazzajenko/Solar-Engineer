import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './blocks.reducer'
import { selectRouteParams } from '../../../../../store/router.selectors'
import { BlockModel } from '../../../../models/block.model'

export const selectBlocksState = createFeatureSelector<State.BlocksState>('blocks')

export const selectBlocksEntities = createSelector(selectBlocksState, State.selectEntities)

export const selectAllBlocks = createSelector(selectBlocksState, State.selectAll)

export const selectBlocksByProjectIdRouteParams = createSelector(
  selectAllBlocks,
  selectRouteParams,
  (blocks, { projectId }) => {
    if (blocks) {
      return blocks.filter((block) => block.projectId === Number(projectId))
    }
    return []
  },
)

export const selectBlocksByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.filter((block) => block.projectId === Number(props.projectId)),
  )
