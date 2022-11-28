import { DisconnectionPointModel } from './../../models/disconnection-point.model'
import { BlockModel } from './../../models/block.model'
import { PanelLinkModel } from './../../models/panel-link.model'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'

export const SelectedStateActions = createActionGroup({
  source: 'Selected State',
  events: {
    'Select Unit': props<{ unit: UnitModel }>(),
    'Toggle Multi Select': props<{ multiSelect: boolean }>(),
    'Select Id': props<{ id: string }>(),
    'Select Multi Ids': props<{ ids: string[] }>(),
    'Select Panel': props<{ panelId: string }>(),
    'Select String': props<{ stringId: string }>(),
    'Set Selected Panel Links': props<{ panelLink: PanelLinkModel }>(),
    'Add To Join Type': props<{ unit: UnitModel }>(),
    'Add To Join Panel': props<{ panel: PanelModel }>(),
    'Add To Join Dp': props<{ disconnectionPoint: DisconnectionPointModel }>(),
    'Clear Selected State': emptyProps(),
  },
})
