import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

import { ProjectsHubActions } from './projects-hub.actions'
import { ProjectSignalrEvent } from '@shared/data-access/models'

export const PROJECTS_HUB_FEATURE_KEY = 'projects-hub'

export interface ProjectsHubState extends EntityState<ProjectSignalrEvent> {
  loaded: boolean
  error?: string | null
}

export interface ProjectsHubPartialState {
  readonly [PROJECTS_HUB_FEATURE_KEY]: ProjectsHubState
}

export const projectsHubAdapter: EntityAdapter<ProjectSignalrEvent> =
  createEntityAdapter<ProjectSignalrEvent>({
    selectId: (a) => a.requestId,
  })

export const initialProjectsHubState: ProjectsHubState = projectsHubAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialProjectsHubState,
  on(ProjectsHubActions.sendSignalrRequest, (state, { projectSignalrEvent }) =>
    projectsHubAdapter.addOne(projectSignalrEvent, state),
  ),
  on(ProjectsHubActions.addSignalrRequest, (state, { projectSignalrEvent }) =>
    projectsHubAdapter.addOne(projectSignalrEvent, state),
  ),
  on(ProjectsHubActions.updateSignalrRequest, (state, { update }) =>
    projectsHubAdapter.updateOne(update, state),
  ),
  on(ProjectsHubActions.updateManySignalrRequests, (state, { updates }) =>
    projectsHubAdapter.updateMany(updates, state),
  ),
)

export function projectsHubReducer(state: ProjectsHubState | undefined, action: Action) {
  return reducer(state, action)
}
