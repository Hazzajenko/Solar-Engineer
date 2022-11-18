import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { createReducer, on } from '@ngrx/store'
import { BlocksStateActions } from './blocks.actions'
import { BlockModel } from '../../models/block.model'

export const selectBlockId = (b: BlockModel): string => b.id

export const blockAdapter: EntityAdapter<BlockModel> =
  createEntityAdapter<BlockModel>({
    selectId: selectBlockId,
  })

export const initialBlocksState = blockAdapter.getInitialState({})

export const blocksReducer = createReducer(
  initialBlocksState,

  on(BlocksStateActions.addBlockForGrid, (state, { block }) =>
    blockAdapter.addOne(block, state),
  ),

  on(BlocksStateActions.addManyBlocksForGrid, (state, { blocks }) =>
    blockAdapter.addMany(blocks, state),
  ),

  on(BlocksStateActions.updateBlockForGrid, (state, { block }) =>
    blockAdapter.updateOne(
      {
        id: block.id,
        changes: block,
      },
      state,
    ),
  ),

  on(BlocksStateActions.updateManyBlocksForGrid, (state, { blocks }) =>
    blockAdapter.updateMany(blocks, state),
  ),

  on(BlocksStateActions.deleteBlockForGrid, (state, { block }) =>
    blockAdapter.removeOne(block.id, state),
  ),

  on(BlocksStateActions.clearBlocksState, (state) =>
    blockAdapter.removeAll(state),
  ),
)

export const { selectIds, selectEntities, selectAll } =
  blockAdapter.getSelectors()

export type BlocksState = EntityState<BlockModel>
