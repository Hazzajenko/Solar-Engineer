import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { createReducer, on, Action } from '@ngrx/store'

import * as BlocksActions from './blocks.actions'
import { BlocksEntity } from './blocks.models'

export const BLOCKS_FEATURE_KEY = 'blocks'

export interface BlocksState extends EntityState<BlocksEntity> {
  selectedId?: string | number // which Blocks record has been selected
  loaded: boolean // has the Blocks list been loaded
  error?: string | null // last known error (if any)
}

export interface BlocksPartialState {
  readonly [BLOCKS_FEATURE_KEY]: BlocksState
}

export const blocksAdapter: EntityAdapter<BlocksEntity> = createEntityAdapter<BlocksEntity>()

export const initialBlocksState: BlocksState = blocksAdapter.getInitialState({
  // set initial required properties
  loaded: false,
})

const reducer = createReducer(
  initialBlocksState,
  on(BlocksActions.initBlocks, (state) => ({ ...state, loaded: false, error: null })),
  on(BlocksActions.loadBlocksSuccess, (state, { blocks }) =>
    blocksAdapter.setAll(blocks, { ...state, loaded: true }),
  ),
  on(BlocksActions.loadBlocksFailure, (state, { error }) => ({ ...state, error })),
)

export function blocksReducer(state: BlocksState | undefined, action: Action) {
  return reducer(state, action)
}
