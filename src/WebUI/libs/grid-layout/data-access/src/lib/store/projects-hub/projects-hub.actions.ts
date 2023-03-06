import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const ProjectsHubActions = createActionGroup({
  source: 'Projects Hub Store',
  events: {
    'Send SignalR Request': props<{ request: any }>(),
    'Cancel SignalR Request': emptyProps(),
  },
})
