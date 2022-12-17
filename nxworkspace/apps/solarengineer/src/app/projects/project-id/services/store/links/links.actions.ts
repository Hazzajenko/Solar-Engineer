import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel.model'
import { DisconnectionPointModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/disconnection-point.model'
import { TypeModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/type.model'
import { CableModel } from '../../../../models/deprecated-for-now/cable.model'

export const LinksStateActions = createActionGroup({
  source: 'Links State',
  events: {
    'Add To Link Type': props<{ unit: TypeModel }>(),
    'Start Link Panel': props<{ panelId: string }>(),
    'Finish Link Panel': props<{ panelId: string }>(),
    'Add To Link Panel': props<{ panel: PanelModel }>(),
    'Clear Panel Links': emptyProps(),
    'Add To Link Dp': props<{ disconnectionPoint: DisconnectionPointModel }>(),
    'Add To Link Cable': props<{ cable: CableModel }>(),
    // 'Add To Panel Join': props<{ panel: PanelModel }>(),
    // 'Add To Block Join': props<{ block: BlockModel }>(),
    'Clear Link State': emptyProps(),
  },
})
