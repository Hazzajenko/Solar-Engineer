import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { UnitModel } from '../../models/unit.model'

export const SelectedStateActions = createActionGroup({
  source: 'Selected State',
  events: {
    'Select Unit': props<{ unit: UnitModel }>(),
    'Toggle Multi Select': props<{ multiSelect: boolean }>(),
    'Select Id': props<{ id: string }>(),
    'Select Multi Ids': props<{ ids: string[] }>(),
    'Clear Selected State': emptyProps(),
  },
})
