import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { SignalrRequest } from '../../services/projects-hub/signalr.request'
// import { SignalrRequest } from '@shared/data-access/models'

export const ProjectsHubActions = createActionGroup({
  source: 'Projects Hub Store',
  events: {
    'Send SignalR Request': props<{ signalrRequest: SignalrRequest<unknown> }>(),
    'Cancel SignalR Request': emptyProps(),
  },
})
