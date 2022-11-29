import { PanelLinkModel } from '../../models/panel-link.model'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { UnitModel } from '../../models/unit.model'

export const SelectedStateActions = createActionGroup({
  source: 'Selected State',
  events: {
    'Select Unit': props<{ unit: UnitModel }>(),
    'Toggle Multi Select': props<{ multiSelect: boolean }>(),
    'Select Id': props<{ id: string }>(),
    'Select Multi Ids': props<{ ids: string[] }>(),
    'Select Panel': props<{ panelId: string }>(),
    'Select String': props<{ stringId: string }>(),
    'Set Selected String Panels': props<{ panelIds: string[] }>(),
    'Set Selected String Tooltip': props<{ tooltip: string }>(),
    'Set Selected Panel Links': props<{ panelLink: PanelLinkModel }>(),
    'Clear Selected State': emptyProps(),
  },
})
