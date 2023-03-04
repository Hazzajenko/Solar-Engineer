import { ClientXY } from '../../models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { BlockType } from '@shared/data-access/models'

export const GridActions = createActionGroup({
  source: 'Grid Service',
  events: {
    'Change Create Type': props<{ createType: BlockType }>(),
    'Select GridMode Create': emptyProps(),
    'Select GridMode Delete': emptyProps(),
    'Select GridMode Link': emptyProps(),
    'Select GridMode Select': emptyProps(),
    'Set ClientXY': props<{ clientXY: ClientXY }>(),
    'Clear ClientXY': emptyProps(),
    'Clear Grid State': emptyProps(),
  },
})
