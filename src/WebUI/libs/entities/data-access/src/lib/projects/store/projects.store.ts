import { inject, makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import { selectAllProjects, selectProjectsEntities } from './projects.selectors'
import { isNotNull } from '@shared/utils'
import { ProjectsActions } from './projects.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { ProjectId, ProjectModel } from '@entities/shared'
import { PROJECTS_FEATURE_KEY, projectsReducer } from './projects.reducer'

export function provideProjectsFeature() {
	return makeEnvironmentProviders([provideState(PROJECTS_FEATURE_KEY, projectsReducer)])
}

export function injectProjectsStore() {
	const store = inject(Store)
	// const feature = projectsFeature
	// feature.
	const allProjects$ = store.select(selectAllProjects)
	const allProjects = store.selectSignal(selectAllProjects)
	const entities = store.selectSignal(selectProjectsEntities)

	return {
		get allProjects$() {
			return allProjects$
		},
		get allProjects() {
			return store.selectSignal(selectAllProjects)()
		},
		getById(id: string) {
			return entities()[id]
		},
		getByIdOrUndefined(id: string | undefined) {
			return id ? entities()[id] : undefined
		},
		getByIds(ids: string[]) {
			return ids.map((id) => entities()[id]).filter(isNotNull)
		},
		addProject(project: ProjectModel) {
			store.dispatch(ProjectsActions.addProject({ project }))
		},
		addManyProjects(projects: ProjectModel[]) {
			store.dispatch(ProjectsActions.addManyProjects({ projects }))
		},
		updateProject(update: UpdateStr<ProjectModel>) {
			store.dispatch(ProjectsActions.updateProject({ update }))
		},
		updateManyProjects(updates: UpdateStr<ProjectModel>[]) {
			store.dispatch(ProjectsActions.updateManyProjects({ updates }))
		},
		deleteProject(projectId: ProjectId) {
			store.dispatch(ProjectsActions.deleteProject({ projectId }))
		},
		deleteManyProjects(projectIds: ProjectId[]) {
			store.dispatch(ProjectsActions.deleteManyProjects({ projectIds }))
		},
		clearProjectsState() {
			store.dispatch(ProjectsActions.clearProjectsState())
		},
	}
}

export type ProjectsStore = ReturnType<typeof injectProjectsStore>
