import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ProjectSignalrEvent } from '@shared/data-access/models'
import { Update } from '@ngrx/entity'

export const SignalrEventsActions = createActionGroup({
  source: 'Signalr Events Store',
  events: {
    'Add SignalR Event': props<{ projectSignalrEvent: ProjectSignalrEvent }>(),
    'Add Many SignalR Events': props<{ projectSignalrEvents: ProjectSignalrEvent[] }>(),
    'Send SignalR Event': props<{ projectSignalrEvent: ProjectSignalrEvent }>(),
    'Update SignalR Event': props<{ update: Update<ProjectSignalrEvent> }>(),
    'Update Many SignalR Events': props<{ updates: Update<ProjectSignalrEvent>[] }>(),
    'Receive SignalR Event': props<{ projectSignalrEvent: ProjectSignalrEvent }>(),
    'Receive Many SignalR Events': props<{ projectSignalrEvents: ProjectSignalrEvent[] }>(),
    'Cancel SignalR Event': emptyProps(),
  },
})
