import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GridPanelModel } from '@shared/data-access/models'

export const GridPanelsActions = createActionGroup({
  source: 'Panels Store',
  events: {
    'Init Panels': props<{
      projectId: number
    }>(),
    'Load Panels Success': props<{
      panels: GridPanelModel[]
    }>(),
    'Load Panels Failure': props<{
      error: string | null
    }>(),
    'Add Panel': props<{
      panel: GridPanelModel
    }>(),
    'Add Panel Without Signalr': props<{
      panel: GridPanelModel
    }>(),
    'Add Many Panels': props<{
      panels: GridPanelModel[]
    }>(),
    'Add Many Panels Without Signalr': props<{
      panels: GridPanelModel[]
    }>(),
    'Update Panel': props<{
      update: UpdateStr<GridPanelModel>
    }>(),
    'Update Panel Without Signalr': props<{
      update: UpdateStr<GridPanelModel>
    }>(),
    'Update Many Panels': props<{
      updates: UpdateStr<GridPanelModel>[]
    }>(),
    'Update Many Panels Without Signalr': props<{
      updates: UpdateStr<GridPanelModel>[]
    }>(),
    'Delete Panel': props<{
      panelId: string
    }>(),
    'Delete Panel Without Signalr': props<{
      panelId: string
    }>(),
    'Delete Many Panels': props<{
      panelIds: string[]
    }>(),
    'Delete Many Panels Without Signalr': props<{
      panelIds: string[]
    }>(),
    'Clear Panels State': emptyProps(),
  },
})