import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ProjectModel } from '@shared/data-access/models'
import * as ts from 'typescript/lib/tsserverlibrary'
import { LocalProjectModel } from './local-project.model'
import Project = ts.server.Project

export const ProjectsActions = createActionGroup({
  source: 'Projects Store',
  events: {
    'Init Projects': emptyProps(),
    'Init Local Project': props<{ localProject: LocalProjectModel }>(),
    'Load Local Project Success': props<{ project: ProjectModel }>(),
    'Load Projects Success': props<{ projects: ProjectModel[] }>(),
    'Load Projects Failure': props<{ error: string | null }>(),
    'Init Select Project': props<{ projectId: number }>(),
    'Create Web Project': props<{ projectName: string }>(),
    'Create Web Project Success': props<{ project: ProjectModel }>(),
    'Create Web Project Error': props<{ error: string | null }>(),
  },
})