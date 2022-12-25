import { PanelLinksToModel } from '@shared/data-access/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { TypeModel } from '@shared/data-access/models'

export const SelectedActions = createActionGroup({
  source: 'Selected Store',
  events: {
    'Select Type': props<{ objectType: TypeModel }>(),
    'Toggle Multi Select': props<{ multiSelect: boolean }>(),
    'Select Id': props<{ id: string }>(),
    'Select Multi Ids': props<{ ids: string[] }>(),
    'Select Panel': props<{ panelId: string }>(),
    'Select Panel When String Selected': props<{ panelId: string }>(),
    'Start MultiSelect Panel': props<{ panelId: string }>(),
    'Add Panel To MultiSelect': props<{ panelId: string }>(),
    'Select String': props<{ stringId: string }>(),
    'Set Selected String Panels': props<{ panelIds: string[] }>(),
    'Set Selected String Tooltip': props<{ tooltip: string }>(),
    'Set Selected String Link Paths': props<{
      pathMap: Map<string, { link: number; count: number; color: string }>
    }>(),
    'Set Selected Panel Links': props<{ panelLink: PanelLinksToModel }>(),
    'Set Selected Panel Links When String Selected': props<{ panelLink: PanelLinksToModel }>(),
    'Clear Selected Panel Links': emptyProps(),
    'Clear Selected State': emptyProps(),
  },
})
