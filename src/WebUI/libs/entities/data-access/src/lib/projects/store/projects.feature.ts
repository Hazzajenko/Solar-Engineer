import { createFeature, createSelector } from '@ngrx/store'
import { PROJECTS_FEATURE_KEY, projectsAdapter, projectsReducer } from './projects.reducer'

const { selectAll } = projectsAdapter.getSelectors()

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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
