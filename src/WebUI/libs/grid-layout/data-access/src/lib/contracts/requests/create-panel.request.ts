import { ProjectsSignalrRequest } from '@shared/data-access/models'

export interface CreatePanelRequest extends ProjectsSignalrRequest {
  // id: string | undefined
  // projectId: string
  create: {
    id: string
    projectId: string
    stringId: string
    location: string
    panelConfigId: string | undefined
    rotation: number
  }
}
