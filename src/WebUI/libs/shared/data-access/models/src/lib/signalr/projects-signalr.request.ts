import { ProjectItemType } from '../projects'
import { ProjectsSignalrType } from './projects-signalr.type'

export interface ProjectsSignalrRequest {
  requestId: string
  projectId: string
}

export interface ProjectsSignalrRequestV3 {
  requestId: string
  projectId: string
}

export interface ProjectsSignalrRequestV2 {
  requestId: string
  projectId: string
  model: ProjectItemType
  action: ProjectsSignalrType
  time: Date
  receivedSuccess: boolean
  error?: string
}
