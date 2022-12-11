import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import { CableModel } from '../../models/deprecated-for-now/cable.model'

export interface CreateCableRequest {
  location: number
  // location: string
  size: number
  project_id: number
}

export interface UpdateCableRequest {
  project_id: number
  cable: CableModel
  newLocation: number
}

export const CableStateActions = createActionGroup({
  source: 'Cable Service',
  events: {
    'Add Cable Http': props<{ request: CreateCableRequest }>(),
    'Add Cable To State': props<{ cable: CableModel }>(),
    'Add Many Cables': props<{ cables: CableModel[] }>(),
    'Update Cable Http': props<{ request: UpdateCableRequest }>(),
    'Update Cable To State': props<{ cable: CableModel }>(),
    'Update Many Cable': props<{ cables: Update<CableModel>[] }>(),
    'Delete Cable Http': props<{ cableId: number }>(),
    'Delete Cable To State': props<{ cableId: number }>(),
    'Clear Cable State': emptyProps(),
  },
})
