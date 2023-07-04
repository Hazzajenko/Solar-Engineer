import { createRootServiceInjector } from '@shared/utils'
import { Store } from '@ngrx/store'
import { selectSelectedProject, selectSelectedProjectId } from '@entities/data-access'

export function injectCurrentProject() {
	return currentProjectInjector()
}

const currentProjectInjector = createRootServiceInjector(currentProjectFactory, {
	deps: [Store],
})

function currentProjectFactory(store: Store) {
	return store.selectSignal(selectSelectedProject)
}

export function injectCurrentProjectId() {
	return currentProjectIdInjector()
}

const currentProjectIdInjector = createRootServiceInjector(currentProjectIdFactory, {
	deps: [Store],
})

function currentProjectIdFactory(store: Store) {
	return store.selectSignal(selectSelectedProjectId)
}
