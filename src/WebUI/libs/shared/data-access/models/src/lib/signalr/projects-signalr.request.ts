import { ProjectItemType } from '../projects'
import { ProjectEventAction } from './project-event.action'

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
  action: ProjectEventAction
  time: Date
  receivedSuccess: boolean
  error?: string
}
