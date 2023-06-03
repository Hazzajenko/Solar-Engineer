import { inject, makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import { selectAllProjects, selectProjectById, selectProjectsEntities } from './projects.selectors'
import { ProjectsActions } from './projects.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { ProjectId, ProjectModel } from '@entities/shared'
import { PROJECTS_FEATURE_KEY, projectsReducer } from './projects.reducer'
import { provideEffects } from '@ngrx/effects'
import * as ProjectsEffects from './projects.effects'

export function provideProjectsFeature() {
	return makeEnvironmentProviders([
		provideState(PROJECTS_FEATURE_KEY, projectsReducer),
		provideEffects(ProjectsEffects),
	])
}

export function injectProjectsStore() {
	const store = inject(Store)
	const entities = store.selectSignal(selectProjectsEntities)

	const select = {
		allProjects: store.selectSignal(selectAllProjects),
		getById: (id: string) => entities()[id],
		getById2: (id: string) => store.selectSignal(selectProjectById({ id })),
	}

	const dispatch = {
		addProject: (project: ProjectModel) => store.dispatch(ProjectsActions.addProject({ project })),
		addManyProjects: (projects: ProjectModel[]) =>
			store.dispatch(ProjectsActions.addManyProjects({ projects })),
		updateProject: (update: UpdateStr<ProjectModel>) =>
			store.dispatch(ProjectsActions.updateProject({ update })),
		updateManyProjects: (updates: UpdateStr<ProjectModel>[]) =>
			store.dispatch(ProjectsActions.updateManyProjects({ updates })),
		deleteProject: (projectId: ProjectId) =>
			store.dispatch(ProjectsActions.deleteProject({ projectId })),
		deleteManyProjects: (projectIds: ProjectId[]) =>
			store.dispatch(ProjectsActions.deleteManyProjects({ projectIds })),
		clearProjectsState: () => store.dispatch(ProjectsActions.clearProjectsState()),
	}

	return {
		select,
		dispatch,
	}
}

export type ProjectsStore = ReturnType<typeof injectProjectsStore>
