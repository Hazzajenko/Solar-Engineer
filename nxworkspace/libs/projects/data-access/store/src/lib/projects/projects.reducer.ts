import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ProjectModel } from '@shared/data-access/models'

import { ProjectsActions } from './projects.actions'

export const PROJECTS_FEATURE_KEY = 'projects'

export interface ProjectsState extends EntityState<ProjectModel> {
  selectedId?: number
  localProjectId?: number
  localProject?: ProjectModel
  loaded: boolean
  local: boolean
  error?: string | null
}

export interface ProjectsPartialState {
  readonly [PROJECTS_FEATURE_KEY]: ProjectsState
}

export const projectsAdapter: EntityAdapter<ProjectModel> = createEntityAdapter<ProjectModel>()

export const initialProjectsState: ProjectsState = projectsAdapter.getInitialState({
  loaded: false,
  local: true,
})

const reducer = createReducer(
  initialProjectsState,
  on(ProjectsActions.initLocalProject, (state) => ({
    ...state,
    loaded: false,
    error: null,
    local: true,
  })),
  on(ProjectsActions.loadLocalProjectSuccess, (state, { project }) =>
    projectsAdapter.setOne(project, {
      ...state,
      loaded: true,
      local: true,
      localProjectId: project.id,
      localProject: project,
    }),
  ),
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
