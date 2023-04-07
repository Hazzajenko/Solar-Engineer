import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { FreePanelModel } from '@no-grid-layout/shared'

export const FreePanelsActions = createActionGroup({
  source: 'Free Panels Store',
  events: {
    'Init Panels': props<{
      projectId: number
    }>(),
    'Load Panels Success': props<{
      panels: FreePanelModel[]
    }>(),
    'Load Panels Failure': props<{
      error: string | null
    }>(),
    'Add Panel': props<{
      panel: FreePanelModel
    }>(),
    'Add Many Panels': props<{
      panels: FreePanelModel[]
    }>(),
    'Update Panel': props<{
      update: UpdateStr<FreePanelModel>
    }>(),
    'Update Many Panels': props<{
      updates: UpdateStr<FreePanelModel>[]
    }>(),
    'Delete Panel': props<{
      panelId: string
    }>(),
    'Delete Many Panels': props<{
      panelIds: string[]
    }>(),
    'Clear Panels State': emptyProps(),
  },
})