import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '../../../../models/panel.model'
import { DisconnectionPointModel } from '../../../../models/disconnection-point.model'
import { UnitModel } from '../../../../models/unit.model'
import { CableModel } from '../../../../models/cable.model'

export const LinksStateActions = createActionGroup({
  source: 'Links State',
  events: {
    'Add To Link Type': props<{ unit: UnitModel }>(),
    'Add To Link Panel': props<{ panel: PanelModel }>(),
    'Add To Link Dp': props<{ disconnectionPoint: DisconnectionPointModel }>(),
    'Add To Link Cable': props<{ cable: CableModel }>(),
    // 'Add To Panel Join': props<{ panel: PanelModel }>(),
    // 'Add To Block Join': props<{ block: BlockModel }>(),
    'Clear Link State': emptyProps(),
  },
})
