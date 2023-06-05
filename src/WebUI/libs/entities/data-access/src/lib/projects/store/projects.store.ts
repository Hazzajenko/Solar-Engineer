import { Store } from '@ngrx/store'
import {
	selectAllProjects,
	selectProjectById,
	selectProjectReadyForReset,
	selectProjectReadyToRender,
	selectProjectsEntities,
	selectSelectedProject,
	selectSelectedProjectId,
} from './projects.selectors'
import { ProjectsActions } from './projects.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { CreateProjectRequest, ProjectId, ProjectModel } from '@entities/shared'
import { createRootServiceInjector } from '@shared/utils'
import { EntityUpdate } from '@shared/data-access/models'

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
		getById: (id: ProjectId) => entities()[id],
		selectById: (id: ProjectId) => store.selectSignal(selectProjectById({ id })),
		projectReadyToRender: store.selectSignal(selectProjectReadyToRender),
		projectReadyForReset: store.selectSignal(selectProjectReadyForReset),
	}

	const dispatch = {
		createProjectHttp: (request: CreateProjectRequest) =>
			store.dispatch(ProjectsActions.createProjectHttp(request)),
		selectProject: (projectId: ProjectId) =>
			store.dispatch(ProjectsActions.selectProject({ projectId })),
		addProject: (project: ProjectModel) => store.dispatch(ProjectsActions.addProject({ project })),
		addManyProjects: (projects: ProjectModel[]) =>
			store.dispatch(ProjectsActions.addManyProjects({ projects })),
		updateProject: (update: EntityUpdate<ProjectModel>) =>
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
