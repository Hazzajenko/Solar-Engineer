import { PanelLinksToModel } from '../../../../models/deprecated-for-now/panel-links-to.model'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { TypeModel } from '../../../../models/type.model'

export const SelectedStateActions = createActionGroup({
  source: 'Selected State',
  events: {
    'Select Type': props<{ objectType: TypeModel }>(),
    'Toggle Multi Select': props<{ multiSelect: boolean }>(),
    'Select Id': props<{ id: string }>(),
    'Select Multi Ids': props<{ ids: string[] }>(),
    'Select Panel': props<{ panelId: string }>(),
    'Select Panel When String Selected': props<{ panelId: string }>(),
    'Start MultiSelect Panel': props<{ panelId: string }>(),
    'Add Panel To MultiSelect': props<{ panelId: string }>(),
    'Select Cable': props<{ cableId: string }>(),
    'Select Dp': props<{ dpId: string }>(),
    'Select Tray': props<{ trayId: string }>(),
    'Select Rail': props<{ railId: string }>(),
    'Select String': props<{ stringId: string }>(),
    'Set Selected String Panels': props<{ panelIds: string[] }>(),
    'Set Selected String Tooltip': props<{ tooltip: string }>(),
    'Set Selected String Link Paths': props<{
      pathMap: Map<string, { link: number; count: number; color: string }>
    }>(),
    'Set Selected String Link Path Coords': props<{ panelId: string; x: number; y: number }>(),
    'Set Selected Panel Links': props<{ panelLink: PanelLinksToModel }>(),
    'Set Selected Panel Links When String Selected': props<{ panelLink: PanelLinksToModel }>(),
    'Clear Selected Panel Links': emptyProps(),
    'Clear Selected State': emptyProps(),
  },
})
