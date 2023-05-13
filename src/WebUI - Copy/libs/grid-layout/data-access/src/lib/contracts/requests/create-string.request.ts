import { ProjectsSignalrRequest } from '@shared/data-access/models'

export interface CreateStringRequest extends ProjectsSignalrRequest {
  /*  id: string
    projectId: string
    name: string
    color?: string*/
  create: {
    id: string
    projectId: string
    name: string
    color?: string
  }
}
