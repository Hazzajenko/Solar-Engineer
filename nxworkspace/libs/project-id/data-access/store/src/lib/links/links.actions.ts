import { createActionGroup, props } from '@ngrx/store'
import { PanelLinkModel } from '@shared/data-access/models'

export const LinksActions = createActionGroup({
  source: 'Links Store',
  events: {
    'Init Links': props<{ projectId: number }>(),
    'Load Links Success': props<{ links: PanelLinkModel[] }>(),
    'Load Links Failure': props<{ error: string | null }>(),
  },
})
