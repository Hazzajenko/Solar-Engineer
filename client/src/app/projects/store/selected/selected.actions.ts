import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { StringModel } from '../../models/string.model'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'

export const SelectedStateActions = createActionGroup({
  source: 'Selected State',
  events: {
    'Select Unit For Selected State': props<{ unit: UnitModel }>(),
    'Select String': props<{ string: StringModel }>(),
    'Select Tracker Strings': props<{ strings: StringModel[] }>(),
    'Select Inverter Strings': props<{ strings: StringModel[] }>(),
    'Select Panel': props<{ panel: PanelModel }>(),
    'Clear Selected State': emptyProps(),
  },
})
