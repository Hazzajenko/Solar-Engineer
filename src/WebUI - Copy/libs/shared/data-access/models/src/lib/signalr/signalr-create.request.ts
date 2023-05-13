import { ProjectsSignalrRequest } from './projects-signalr.request'

export interface SignalrCreateRequest<TModel> extends ProjectsSignalrRequest {
  create: TModel
}
