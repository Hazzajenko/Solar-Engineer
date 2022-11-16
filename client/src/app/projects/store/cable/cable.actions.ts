import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import { CableModel } from '../../models/cable.model'

export const CableStateActions = createActionGroup({
  source: 'Cable Service',
  events: {
    'Add Cable': props<{ cable: CableModel }>(),
    'Add Many Cables': props<{ cables: CableModel[] }>(),
    'Update Cable': props<{ cable: CableModel }>(),
    'Update Many Cable': props<{ cables: Update<CableModel>[] }>(),
    'Delete Cable': props<{ cable: CableModel }>(),
    'Clear Cable State': emptyProps(),
  },
})
