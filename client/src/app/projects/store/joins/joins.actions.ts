import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '../../models/panel.model'
import { BlockModel } from '../../models/block.model'
import { DisconnectionPointModel } from '../../models/disconnection-point.model'
import { UnitModel } from '../../models/unit.model'

export const JoinsStateActions = createActionGroup({
  source: 'Joins State',
  events: {
    'Add To Join Type': props<{ unit: UnitModel }>(),
    'Add To Join Panel': props<{ panel: PanelModel }>(),
    'Add To Join Dp': props<{ disconnectionPoint: DisconnectionPointModel }>(),
    // 'Add To Panel Join': props<{ panel: PanelModel }>(),
    // 'Add To Block Join': props<{ block: BlockModel }>(),
    'Clear Panel Join State': emptyProps(),
  },
})
