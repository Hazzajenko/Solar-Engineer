import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { BlockModel } from '@shared/data-access/models'

import { BlocksActions } from './blocks.actions'

export const BLOCKS_FEATURE_KEY = 'blocks'

export interface BlocksState extends EntityState<BlockModel> {
  loaded: boolean
  error?: string | null
}

export interface BlocksPartialState {
  readonly [BLOCKS_FEATURE_KEY]: BlocksState
}

export const blocksAdapter: EntityAdapter<BlockModel> = createEntityAdapter<BlockModel>()

export const initialBlocksState: BlocksState = blocksAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialBlocksState,
  on(BlocksActions.addBlockForGrid, (state, { block }) => blocksAdapter.addOne(block, state)),

  on(BlocksActions.addManyBlocksForGrid, (state, { blocks }) =>
    blocksAdapter.addMany(blocks, state),
  ),

  on(BlocksActions.updateBlockForGrid, (state, { update }) =>
    blocksAdapter.updateOne(update, state),
  ),

  on(BlocksActions.updateManyBlocksForGrid, (state, { updates }) =>
    blocksAdapter.updateMany(updates, state),
  ),

  on(BlocksActions.deleteBlockForGrid, (state, { blockId }) =>
    blocksAdapter.removeOne(blockId, state),
  ),

  on(BlocksActions.deleteManyBlocksForGrid, (state, { blockIds }) =>
    blocksAdapter.removeMany(blockIds, state),
  ),

  on(BlocksActions.clearBlocksState, (state) => blocksAdapter.removeAll(state)),
)

export function blocksReducer(state: BlocksState | undefined, action: Action) {
  return reducer(state, action)
}
