import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './blocks.reducer'
import { selectRouteParams } from '@shared/data-access/store'
import { BlockModel } from '@shared/data-access/models'

export const selectBlocksState = createFeatureSelector<State.BlocksState>('blocks')

export const selectBlocksEntities = createSelector(selectBlocksState, State.blockAdapter.getSelectors().selectEntities)

export const selectAllBlocks = createSelector(selectBlocksState, State.blockAdapter.getSelectors().selectAll)

export const selectBlockByLocation = (props: { location: string }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.find((block) => block.location === props.location),
  )
export const selectBlocksByProjectIdRouteParams = createSelector(
  selectAllBlocks,
  selectRouteParams,
  (blocks, { projectId }) => {
    if (blocks) {
      return blocks.filter((block: { projectId: number }) => block.projectId === Number(projectId))
    }
    return []
  },
)

export const selectBlocksByProjectId = (props: { projectId: number }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.filter((block) => block.projectId === Number(props.projectId)),
  )
