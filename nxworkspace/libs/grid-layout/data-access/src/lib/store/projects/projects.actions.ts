import { createAction, props } from '@ngrx/store'
import { ProjectModel } from '@shared/data-access/models'

export const selectProject = createAction(
  '[Projects Service] Add One ProjectModel',
  props<{ project: ProjectModel }>(),
)

export const addUserProjects = createAction(
  '[Projects Service] Add User Projects',
  props<{ projects: ProjectModel[] }>(),
)

export const modifiedProject = createAction(
  '[Projects Service] Modified ProjectModel',
  props<{ project: ProjectModel }>(),
)

export const removeProject = createAction(
  '[Projects Service] Remove ProjectModel',
  props<{ project: ProjectModel }>(),
)

export const clearProjectsState = createAction('[Projects Service] Clear Projects State')
