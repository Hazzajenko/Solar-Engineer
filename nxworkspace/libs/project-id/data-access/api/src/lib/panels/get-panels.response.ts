import { PanelModel } from '@shared/data-access/models'

export interface GetPanelsResponse {
  panels: PanelModel[]
}

export interface OnePanelResponse {
  panel: PanelModel
}
