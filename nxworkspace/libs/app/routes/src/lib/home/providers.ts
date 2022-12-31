import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, projectsReducer } from '@projects/data-access/store'
import { ProjectsEffects } from '@projects/data-access/effects'
export const homeProviders = [
  provideState(PROJECTS_FEATURE_KEY, projectsReducer),
  provideEffects([ProjectsEffects]),
]
