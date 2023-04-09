import { GridPanelModel } from '@shared/data-access/models'

export interface ManyPanelsResponse {
  panels: GridPanelModel[]
}

export interface PanelResponse {
  panel: GridPanelModel
}

export interface UpdateManyPanelsResponse {
  successfulUpdates: number
  errors: number
}

export interface DeletePanelResponse {
  panelId: string
}

export interface DeleteManyPanelsResponse {
  // stringIds: string[]
  successfulDeletes: number
  errors: number
}