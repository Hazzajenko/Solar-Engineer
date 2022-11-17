import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import { CableModel } from '../../models/cable.model'

export interface CreateCableRequest {
  location: string
  size: number
  project_id: number
}

export const CableStateActions = createActionGroup({
  source: 'Cable Service',
  events: {
    'Add Cable Http': props<{ request: CreateCableRequest }>(),
    'Add Cable To State': props<{ cable: CableModel }>(),
    'Add Many Cables': props<{ cables: CableModel[] }>(),
    'Update Cable': props<{ cable: CableModel }>(),
    'Update Many Cable': props<{ cables: Update<CableModel>[] }>(),
    'Delete Cable': props<{ cable: CableModel }>(),
    'Clear Cable State': emptyProps(),
  },
})
