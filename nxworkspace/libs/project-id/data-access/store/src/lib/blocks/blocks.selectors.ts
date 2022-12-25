import { createFeatureSelector, createSelector } from '@ngrx/store'
import { BLOCKS_FEATURE_KEY, BlocksState, blocksAdapter } from './blocks.reducer'

// Lookup the 'Blocks' feature state managed by NgRx
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

export const selectSelectedId = createSelector(
  selectBlocksState,
  (state: BlocksState) => state.selectedId,
)

export const selectEntity = createSelector(
  selectBlocksEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
)
