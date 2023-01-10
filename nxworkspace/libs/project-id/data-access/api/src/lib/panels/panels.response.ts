import { PanelModel } from '@shared/data-access/models'

export interface ManyPanelsResponse {
  panels: PanelModel[]
}

export interface PanelResponse {
  panel: PanelModel
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