import { PanelModel } from '../types'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const PanelsActions = createActionGroup({
  source: 'Design Panels Store',
  events: {
    'Init Panels': props<{
      projectId: number
    }>(),
    'Load Panels Success': props<{
      panels: PanelModel[]
    }>(),
    'Load Panels Failure': props<{
      error: string | null
    }>(),
    'Add Panel': props<{
      panel: PanelModel
    }>(),
    'Add Many Panels': props<{
      panels: PanelModel[]
    }>(),
    'Update Panel': props<{
      update: UpdateStr<PanelModel>
    }>(),
    'Update Many Panels': props<{
      updates: UpdateStr<PanelModel>[]
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