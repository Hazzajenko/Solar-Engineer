import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ConnectionModel } from '@shared/data-access/models'

export const ConnectionsActions = createActionGroup({
  source: 'Connections Store',
  events: {
    'Init Connections': emptyProps(),
    'Add Connection': props<{ connection: ConnectionModel }>(),
    'Add Many Connections': props<{ connections: ConnectionModel[] }>(),
    'Remove Connection': props<{ connection: ConnectionModel }>(),
    'Remove Many Connections': props<{ connections: ConnectionModel[] }>(),
    'Connection Not Friend': emptyProps(),
    'Clear Connections State': emptyProps(),
  },
})
