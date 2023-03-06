import { PanelModel } from '@shared/data-access/models'

export interface UpdatePanelRequest {
  id: string
  projectId: string
  stringId: string
  changes: Partial<PanelModel>
}
