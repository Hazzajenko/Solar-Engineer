import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '@shared/data-access/models'
import { DisconnectionPointModel } from '@shared/data-access/models'
import { TypeModel } from '@shared/data-access/models'
import { CableModel } from '@shared/data-access/models'

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
