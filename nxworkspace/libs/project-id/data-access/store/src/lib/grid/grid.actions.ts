import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { TypeModel } from '@shared/data-access/models'

export const GridActions = createActionGroup({
  source: 'Grid Service',
  events: {
    'Change Create Type': props<{ createType: TypeModel }>(),
    'Select GridMode Create': emptyProps(),
    'Select GridMode Delete': emptyProps(),
    'Select GridMode Link': emptyProps(),
    'Select GridMode Select': emptyProps(),
    'Clear Grid State': emptyProps(),
  },
})
