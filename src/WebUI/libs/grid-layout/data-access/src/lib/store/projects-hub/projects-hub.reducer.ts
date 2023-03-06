import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

import { ProjectsHubActions } from './projects-hub.actions'

export const PROJECTS_HUB_FEATURE_KEY = 'projects-hub'

export interface ProjectsHubSate extends EntityState<any> {
  loaded: boolean
  error?: string | null
}

export interface ProjectsHubPartialState {
  readonly [PROJECTS_HUB_FEATURE_KEY]: ProjectsHubSate
}

export const projectsHubAdapter: EntityAdapter<any> = createEntityAdapter<any>()

export const initialProjectsHubState: ProjectsHubSate = projectsHubAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialProjectsHubState,
  on(ProjectsHubActions.sendSignalrRequest, (state, { request }) =>
    projectsHubAdapter.addOne(request, state),
  ),
)

export function projectsHubReducer(state: ProjectsHubSate | undefined, action: Action) {
  return reducer(state, action)
}
