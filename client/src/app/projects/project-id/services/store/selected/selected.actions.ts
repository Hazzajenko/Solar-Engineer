import { PanelLinksToModel } from '../../../../models/panel-links-to.model'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { UnitModel } from '../../../../models/unit.model'

export const SelectedStateActions = createActionGroup({
  source: 'Selected State',
  events: {
    'Select Unit': props<{ unit: UnitModel }>(),
    'Toggle Multi Select': props<{ multiSelect: boolean }>(),
    'Select Id': props<{ id: string }>(),
    'Select Multi Ids': props<{ ids: string[] }>(),
    'Select Panel': props<{ panelId: string }>(),
    'Select Cable': props<{ cableId: string }>(),
    'Select Dp': props<{ dpId: string }>(),
    'Select String': props<{ stringId: string }>(),
    'Set Selected String Panels': props<{ panelIds: string[] }>(),
    'Set Selected String Tooltip': props<{ tooltip: string }>(),
    'Set Selected Panel Links': props<{ panelLink: PanelLinksToModel }>(),
    'Clear Selected State': emptyProps(),
  },
})
