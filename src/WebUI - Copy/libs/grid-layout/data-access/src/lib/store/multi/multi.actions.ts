import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const MultiActions = createActionGroup({
  source: 'Multi State',
  events: {
    'Start Multi Select': props<{ location: string }>(),
    'Finish Multi Select': props<{ location: string }>(),
    'Start Multi Delete': props<{ location: string }>(),
    'Finish Multi Delete': props<{ location: string }>(),
    'Start Multi Create Panel': props<{ location: string }>(),
    'Finish Multi Create Panel': props<{ location: string }>(),
    'Clear Multi State': emptyProps(),
  },
})
