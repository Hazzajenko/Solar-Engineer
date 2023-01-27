import { createFeatureSelector, createSelector } from '@ngrx/store'
import { BlockModel } from '@shared/data-access/models'
import { RouterSelectors } from '@shared/data-access/router'
import { selectProjectByRouteParams } from 'libs/projects/data-access/store/src/lib/projects/projects.selectors'
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

export const selectBlockById = (props: { id: string }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.find((block) => block.id === props.id),
  )

export const selectBlockByLocation = (props: { location: string }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.find((block) => block.location === props.location),
  )

export const selectBlocksFromArray = (props: { locationArray: string[] }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.filter((block) => props.locationArray.includes(block.location)),
  )

export const selectBlockIdsFromArray = (props: { locationArray: string[] }) =>
  createSelector(selectAllBlocks, (blocks: BlockModel[]) =>
    blocks.filter((block) => props.locationArray.includes(block.location)).map((block) => block.id),
  )

export const selectBlocksByProjectIdRouteParams = createSelector(
  selectAllBlocks,
  RouterSelectors.selectRouteParams,
  (blocks, { projectId }) => {
    if (!projectId) {
      return blocks.filter((block) => block.projectId === 0)
    }
    if (blocks) {
      return blocks.filter((block) => block.projectId === Number(projectId))
    }
    return []
  },
)

export const selectBlocksByProjectNameRouteParams = createSelector(
  selectProjectByRouteParams,
  selectAllBlocks,
  (project, blocks) => {
    if (!project) {
      return blocks.filter((block) => block.projectId === 0)
    }
    if (blocks) {
      return blocks.filter((block) => block.projectId === project.id)
    }
    return []
  },
)
