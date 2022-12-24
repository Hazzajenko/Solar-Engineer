import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ProjectModel } from '@shared/data-access/models'

export const ProjectsActions = createActionGroup({
  source: 'Projects Store',
  events: {
    'Init Projects': emptyProps(),
    'Load Projects Success': props<{ projects: ProjectModel[] }>(),
    'Load Projects Failure': props<{ error: string | null }>(),
    'Init Select Project': props<{ projectId: number }>(),
  },
})
