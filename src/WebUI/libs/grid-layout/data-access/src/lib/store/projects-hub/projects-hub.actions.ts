import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { SignalrRequest } from '@shared/data-access/models'

export const ProjectsHubActions = createActionGroup({
  source: 'Projects Hub Store',
  events: {
    'Send SignalR Request': props<{ signalrRequest: SignalrRequest }>(),
    'Cancel SignalR Request': emptyProps(),
  },
})
