import { provideState } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, projectsReducer } from './projects.reducer'
import { makeEnvironmentProviders } from '@angular/core'
import { provideEffects } from '@ngrx/effects'
import * as ProjectsSignalrEffects from './projects.effects'

export function provideProjectsFeature() {
	return makeEnvironmentProviders([
		provideState(PROJECTS_FEATURE_KEY, projectsReducer),
		provideEffects(ProjectsSignalrEffects),
	])
}
