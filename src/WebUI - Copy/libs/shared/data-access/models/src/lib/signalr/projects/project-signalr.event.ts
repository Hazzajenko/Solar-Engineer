import { ProjectItemType } from '../../projects'
import { ProjectEventAction } from '../project-event.action'

export interface ProjectSignalrEvent {
  action: ProjectEventAction
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

export interface ProjectSignalrJsonRequest {
  projectId: string
  requestId: string
  action: ProjectEventAction
  model: ProjectItemType
  data: string
}

export interface ProjectSignalrEventV2 {
  action: ProjectEventAction
  byAppUserId?: string
  data: string
  error?: string
  isSuccess: boolean
  model: ProjectItemType
  projectId: string
  requestId: string
  time: Date
  serverTime?: Date
  timeDiff?: number
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
