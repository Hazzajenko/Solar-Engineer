import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, projectsReducer, ProjectsEffects } from '@projects/data-access/store'
export const homeProviders = [
  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
  provideEffects([ProjectsEffects]),
]
