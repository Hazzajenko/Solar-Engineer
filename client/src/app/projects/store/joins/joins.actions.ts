import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '../../models/panel.model'
import { BlockModel } from '../../models/block.model'

export const JoinsStateActions = createActionGroup({
  source: 'Joins State',
  events: {
    'Add To Panel Join': props<{ panel: PanelModel }>(),
    'Add To Block Join': props<{ block: BlockModel }>(),
    'Clear Panel Join State': emptyProps(),
  },
})
