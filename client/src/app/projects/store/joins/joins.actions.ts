import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '../../models/panel.model'

export const JoinsStateActions = createActionGroup({
  source: 'Joins State',
  events: {
    'Add To Panel Join': props<{ panel: PanelModel }>(),
    'Clear Panel Join State': emptyProps(),
  },
})
