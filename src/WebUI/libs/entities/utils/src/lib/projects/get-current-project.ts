import { createRootServiceInjector } from '@shared/utils'
import { Store } from '@ngrx/store'
import { selectSelectedProject } from '@entities/data-access'

export function injectCurrentProject() {
	return currentProjectInjector()
}

const currentProjectInjector = createRootServiceInjector(currentProjectFactory, {
	deps: [Store],
})

function currentProjectFactory(store: Store) {
	return store.selectSignal(selectSelectedProject)
}
