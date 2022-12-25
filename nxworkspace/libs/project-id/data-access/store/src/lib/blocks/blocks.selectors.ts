import { createFeatureSelector, createSelector } from '@ngrx/store'
import { BlockModel } from '@shared/data-access/models'
import { selectRouteParams } from '@shared/data-access/router'
import { BLOCKS_FEATURE_KEY, blocksAdapter, BlocksState } from './blocks.reducer'

export const selectBlocksState = createFeatureSelector<BlocksState>(BLOCKS_FEATURE_KEY)

const { selectAll, selectEntities } = blocksAdapter.getSelectors()

export const selectBlocksLoaded = createSelector(
  selectBlocksState,
  (state: BlocksState) => state.loaded,
)

export const selectBlocksError = createSelector(
  selectBlocksState,
  (state: BlocksState) => state.error,
)

export const selectAllBlocks = createSelector(selectBlocksState, (state: BlocksState) =>
  selectAll(state),
)

export const selectBlocksEntities = createSelector(selectBlocksState, (state: BlocksState) =>
  selectEntities(state),
)

export const selectBlockByLocation = (props: { location: string }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.find((block) => block.location === props.location),
  )
  
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
