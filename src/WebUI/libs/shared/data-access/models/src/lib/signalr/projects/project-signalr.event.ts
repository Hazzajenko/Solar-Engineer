import { ProjectItemType } from '../../projects'
import { ProjectsSignalrType } from '../projects-signalr.type'

export interface ProjectSignalrEvent {
  action: ProjectsSignalrType
  byAppUserId?: string
  data?: string
  error?: string
  isSuccess: boolean
  model: ProjectItemType
  projectId: string
  requestId: string
  time: Date
  serverTime?: Date
  timeDiff?: number
}

export interface ProjectSignalrRequest {
  projectId: string
  requestId: string
  action: ProjectsSignalrType
  model: ProjectItemType
  data: string
}

/*export interface ProjectsSignalrRequestV2 {
  requestId: string
  projectId: string
  model: ProjectItemType
  action: ProjectsSignalrType
  time: Date
  receivedSuccess: boolean
  error?: string
}*/
