import { provideState } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, projectsReducer } from './projects.reducer'
import { makeEnvironmentProviders } from '@angular/core'
import { provideEffects } from '@ngrx/effects'
// import * as ProjectsEffects from './projects.effects'
import * as ProjectsSignalrEffects from './projects.signalr.effects'

export function provideProjectsFeature() {
	return makeEnvironmentProviders([
		provideState(PROJECTS_FEATURE_KEY, projectsReducer), // provideEffects(ProjectsEffects),
		provideEffects(ProjectsSignalrEffects),
	])
}

// const { selectAll } = projectsAdapter.getSelectors()

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/*
 export const projectsFeature = createFeature({
 name: PROJECTS_FEATURE_KEY,
 reducer: projectsReducer,
 extraSelectors: ({
 selectIds,
 selectEntities,
 selectError,
 selectLoaded,
 selectProjectsState,
 }) => ({
 selectIds,
 selectEntities,
 selectError,
 selectLoaded,
 selectProjectsState,
 selectAllProjects: createSelector(selectAll, (projects) => projects),
 selectProjectsEntities: createSelector(selectEntities, (entities) => entities), // selectProjectById: (id: string) => createSelector(selectEntities, (entities) => entities[id]),
 }),
 })
 */
