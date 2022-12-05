import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import { BlockModel } from '../../../../models/block.model'

export const BlocksStateActions = createActionGroup({
  source: 'Grid Service',
  events: {
    'Add Block For Grid': props<{ block: BlockModel }>(),
    'Add Many Blocks For Grid': props<{ blocks: BlockModel[] }>(),
    'Update Block For Grid': props<{
      // oldLocation: number
      block: BlockModel
    }>(),
    'Update Many Blocks For Grid': props<{ blocks: Update<BlockModel>[] }>(),
    'Delete Block For Grid': props<{ block_id: string }>(),
    'Delete Many Blocks For Grid': props<{ blocks: string[] }>(),
    'Clear Blocks State': emptyProps(),
  },
})
