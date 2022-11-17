import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const CellsStateActions = createActionGroup({
  source: 'Cells Service',
  events: {
    'Add Item To Cell Store': props<{ location: string }>(),
    'Add Many Items To Cell Store': props<{ locations: string[] }>(),
    'Update Item In Cell Store': props<{
      oldLocation: string
      newLocation: string
    }>(),
    'Remove Item To Cell Store': props<{ location: string }>(),
    'Remove Many Items To Cell Store': props<{ locations: string[] }>(),
    'Clear Cells State': emptyProps(),
  },
})
