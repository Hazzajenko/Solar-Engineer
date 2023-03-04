import { PathModel } from '@shared/data-access/models'

export interface ManyPathsResponse {
  paths: PathModel[]
}

export interface PathResponse {
  path: PathModel
}

export interface DeletePathResponse {
  pathId: string
}

