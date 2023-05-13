import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { BlockModel } from '@shared/data-access/models'

export const BlocksActions = createActionGroup({
  source: 'Blocks Store',
  events: {
    'Add Block For Grid': props<{ block: BlockModel }>(),
    'Add Many Blocks For Grid': props<{ blocks: BlockModel[] }>(),
    'Update Block For Grid': props<{ update: Update<BlockModel> }>(),
    'Update Many Blocks For Grid': props<{ updates: Update<BlockModel>[] }>(),
    'Delete Block For Grid': props<{ blockId: string }>(),
    'Delete Many Blocks For Grid': props<{ blockIds: string[] }>(),
    'Noop': emptyProps(),
    'Clear Blocks State': emptyProps(),
  },
})
