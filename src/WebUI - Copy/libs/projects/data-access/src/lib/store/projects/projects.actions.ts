import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { LocalProjectModel, ProjectModel } from '@shared/data-access/models'
// import * as ts from 'typescript/lib/tsserverlibrary'
// import { LocalProjectModel } from './local-project.model'
// import Project = ts.server.Project

export const ProjectsActions = createActionGroup({
  source: 'Projects Store',
  events: {
    'Init Projects': emptyProps(),
    'Add Project': props<{ project: ProjectModel }>(),
    'Add Many Projects': props<{ projects: ProjectModel[] }>(),
    'Delete Project': props<{ projectId: string }>(),
    'Init Local Project': props<{ localProject: LocalProjectModel }>(),
    'Load Local Project Success': props<{ project: ProjectModel }>(),
    'Load Projects Success': props<{ projects: ProjectModel[] }>(),
    'Load Projects Failure': props<{ error: string | null }>(),
    'Init Select Project': props<{ projectId: string }>(),
    'Get Project Data': emptyProps(),
    'Create Web Project': props<{ projectName: string }>(),
    'Create Web Project Success': emptyProps(),
    // 'Create Web Project Success': props<{ project: ProjectModel }>(),
    // 'Add Projects': props<{ projects: ProjectModel[] }>(),
    'Create Web Project Error': props<{ error: string | null }>(),
  },
})