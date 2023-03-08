import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ProjectSignalrEvent } from '@shared/data-access/models'
import { Update } from '@ngrx/entity'
// import { SignalrRequest } from '@shared/data-access/models'

export const ProjectsHubActions = createActionGroup({
  source: 'Projects Hub Store',
  events: {
    'Send SignalR Request': props<{ projectSignalrEvent: ProjectSignalrEvent }>(),
    'Add SignalR Request': props<{ projectSignalrEvent: ProjectSignalrEvent }>(),
    'Update SignalR Request': props<{ update: Update<ProjectSignalrEvent> }>(),
    'Update Many SignalR Requests': props<{ updates: Update<ProjectSignalrEvent>[] }>(),
    'Receive SignalR Event': props<{ projectSignalrEvent: ProjectSignalrEvent }>(),
    'Receive Many SignalR Events': props<{ projectSignalrEvents: ProjectSignalrEvent[] }>(),
    'Cancel SignalR Request': emptyProps(),
  },
})
