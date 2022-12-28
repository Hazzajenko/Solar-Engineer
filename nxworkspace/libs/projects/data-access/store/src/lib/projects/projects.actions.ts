import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ProjectModel } from '@shared/data-access/models'
import { LocalProjectModel } from './local-project.model'

export const ProjectsActions = createActionGroup({
  source: 'Projects Store',
  events: {
    'Init Projects': emptyProps(),
    'Init Local Project': props<{ localProject: LocalProjectModel }>(),
    'Load Local Project Success': props<{ project: ProjectModel }>(),
    'Load Projects Success': props<{ projects: ProjectModel[] }>(),
    'Load Projects Failure': props<{ error: string | null }>(),
    'Init Select Project': props<{ projectId: number }>(),
  },
})
