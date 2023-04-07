import { DesignPanelModel } from '../types'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const DesignPanelsActions = createActionGroup({
  source: 'Design Panels Store',
  events: {
    'Init Panels': props<{
      projectId: number
    }>(),
    'Load Panels Success': props<{
      panels: DesignPanelModel[]
    }>(),
    'Load Panels Failure': props<{
      error: string | null
    }>(),
    'Add Panel': props<{
      panel: DesignPanelModel
    }>(),
    'Add Many Panels': props<{
      panels: DesignPanelModel[]
    }>(),
    'Update Panel': props<{
      update: UpdateStr<DesignPanelModel>
    }>(),
    'Update Many Panels': props<{
      updates: UpdateStr<DesignPanelModel>[]
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