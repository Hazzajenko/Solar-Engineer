import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ProjectModel } from '@shared/data-access/models'

import { ProjectsActions } from './projects.actions'

export const PROJECTS_FEATURE_KEY = 'projects'

export interface ProjectsState extends EntityState<ProjectModel> {
  selectedId?: number
  loaded: boolean
  error?: string | null
}

export interface ProjectsPartialState {
  readonly [PROJECTS_FEATURE_KEY]: ProjectsState
}

export const projectsAdapter: EntityAdapter<ProjectModel> = createEntityAdapter<ProjectModel>()

export const initialProjectsState: ProjectsState = projectsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialProjectsState,
  on(ProjectsActions.initProjects, (state) => ({ ...state, loaded: false, error: null })),
  on(ProjectsActions.loadProjectsSuccess, (state, { projects }) =>
    projectsAdapter.setAll(projects, { ...state, loaded: true }),
  ),
  on(ProjectsActions.loadProjectsFailure, (state, { error }) => ({ ...state, error })),
  on(ProjectsActions.initSelectProject, (state, { projectId }) => ({
    ...state,
    selectedId: projectId,
  })),
)

export function projectsReducer(state: ProjectsState | undefined, action: Action) {
  return reducer(state, action)
}
