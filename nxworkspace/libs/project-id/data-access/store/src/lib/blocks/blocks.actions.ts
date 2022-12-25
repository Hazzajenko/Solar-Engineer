import { createAction, props } from '@ngrx/store'
import { BlocksEntity } from './blocks.models'

export const initBlocks = createAction('[Blocks Page] Init')

export const loadBlocksSuccess = createAction(
  '[Blocks/API] Load Blocks Success',
  props<{ blocks: BlocksEntity[] }>(),
)

export const loadBlocksFailure = createAction(
  '[Blocks/API] Load Blocks Failure',
  props<{ error: any }>(),
)
