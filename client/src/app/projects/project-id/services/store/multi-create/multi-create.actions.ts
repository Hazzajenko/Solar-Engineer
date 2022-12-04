import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const MultiCreateActions = createActionGroup({
  source: 'MultiCreate State',
  events: {
    'Start Multi Create Panel': props<{ location: string }>(),
    'Finish Multi Create Panel': props<{ location: string }>(),
    'Start Multi Create Rail': props<{ location: string }>(),
    'Finish Multi Create Rail': props<{ location: string }>(),
    'Clear Multi Create State': emptyProps(),
  },
})
