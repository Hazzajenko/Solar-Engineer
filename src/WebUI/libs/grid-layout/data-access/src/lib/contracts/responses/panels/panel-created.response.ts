import { PanelModel } from '@shared/data-access/models'

export interface PanelCreatedResponse {
  projectId: string
  time: string
  byAppUserId: string
  isSuccess: boolean
  error: string | null
  panel: PanelModel
}
