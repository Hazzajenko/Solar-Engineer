import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ProjectModel } from '@shared/data-access/models'

import { ProjectsActions } from './projects.actions'

export const PROJECTS_FEATURE_KEY = 'projects'

export interface ProjectsState extends EntityState<ProjectModel> {
  selectedId?: number
  selectedProjectId?: number
  localProjectId?: number
  localProject?: ProjectModel
  loaded: boolean
  local: boolean
  web: boolean
  error?: string | null
}

export const projectsAdapter: EntityAdapter<ProjectModel> = createEntityAdapter<ProjectModel>()

export const initialProjectsState: ProjectsState = projectsAdapter.getInitialState({
  loaded: false,
  local: true,
  web: false,
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
    selectedProjectId: projectId,
    web: true,
    local: false,
  })),
  on(ProjectsActions.createWebProjectSuccess, (state, { project }) =>
    projectsAdapter.addOne(project, { ...state, loaded: true }),
  ),
  on(ProjectsActions.createWebProjectError, (state, { error }) => ({ ...state, error })),
)

export function projectsReducer(state: ProjectsState | undefined, action: Action) {
  return reducer(state, action)
}
