import { Update } from '@ngrx/entity'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelLinkModel } from '@shared/data-access/models'

export const LinksActions = createActionGroup({
  source: 'Links Store',
  events: {
    'Init Links': props<{ projectId: number }>(),
    'Load Links Success': props<{ links: PanelLinkModel[] }>(),
    'Load Links Failure': props<{ error: string | null }>(),
    'Add Link': props<{ link: PanelLinkModel }>(),
    'Add Many Links': props<{ links: PanelLinkModel[] }>(),
    'Update Link': props<{ update: Update<PanelLinkModel> }>(),
    'Update Many Links': props<{ updates: Update<PanelLinkModel>[] }>(),
    'Delete Link': props<{ linkId: string }>(),
    'Delete Many Links': props<{ linkIds: string[] }>(),
    'Start Link Panel': props<{ panelId: string }>(),
    'Finish Link Panel': props<{ panelId: string }>(),
    'Clear Links State': emptyProps(),
  },
})

export type LinksActionsTypeObject = Pick<typeof LinksActions[keyof typeof LinksActions], 'type'>

export type LinksActionsType = LinksActionsTypeObject['type']
