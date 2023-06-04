import { makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import {
	selectAllProjects,
	selectProjectById,
	selectProjectsEntities,
	selectSelectedProject,
	selectSelectedProjectId,
} from './projects.selectors'
import { ProjectsActions } from './projects.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { CreateProjectRequest, ProjectId, ProjectModel } from '@entities/shared'
import { PROJECTS_FEATURE_KEY, projectsReducer } from './projects.reducer'
import { provideEffects } from '@ngrx/effects'
import * as ProjectsEffects from './projects.effects'
import { createRootServiceInjector } from '@shared/utils'

export function provideProjectsFeature() {
	return makeEnvironmentProviders([
		provideState(PROJECTS_FEATURE_KEY, projectsReducer),
		provideEffects(ProjectsEffects),
	])
}

export function injectProjectsStore(): ProjectsStoreFactory {
	return projectsStoreInjector()
}

const projectsStoreInjector = createRootServiceInjector(projectsStoreFactory, {
	deps: [Store],
})

export type ProjectsStoreFactory = ReturnType<typeof projectsStoreFactory>

export function projectsStoreFactory(store: Store) {
	const entities = store.selectSignal(selectProjectsEntities)

	const select = {
		allProjects: store.selectSignal(selectAllProjects),
		selectedProjectId: store.selectSignal(selectSelectedProjectId),
		selectedProject: store.selectSignal(selectSelectedProject),
		getById: (id: string) => entities()[id],
		selectById: (id: string) => store.selectSignal(selectProjectById({ id })),
	}

	const dispatch = {
		createProjectHttp: (request: CreateProjectRequest) =>
			store.dispatch(ProjectsActions.createProjectHttp(request)),
		selectProject: (projectId: ProjectId) =>
			store.dispatch(ProjectsActions.selectProject({ projectId })),
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
