import { injectPanelsStore } from '../../panels'
import { injectStringsStore } from '../../strings'
import { injectPanelLinksStore } from '../../panel-links'
import { injectPanelConfigsStore } from '../../panel-configs'
import { createRootServiceInjector } from '@shared/utils'
import { Store } from '@ngrx/store'

export function injectEntityStore(): EntityStore {
	return entityStoreInjector()
}

const entityStoreInjector = createRootServiceInjector(entityStoreFactory, {
	deps: [Store],
})

export type EntityStore = ReturnType<typeof entityStoreFactory>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function entityStoreFactory(_: Store) {
	const panels = injectPanelsStore()
	const panelLinks = injectPanelLinksStore()
	const panelConfigs = injectPanelConfigsStore()
	const strings = injectStringsStore()
	return {
		panels,
		panelLinks,
		panelConfigs,
		strings,
	}
}

/*
 @Injectable({
 providedIn: 'root',
 })
 export class EntityStoreService {
 panels = injectPanelsStore()
 panelLinks = injectPanelLinksStore()
 panelConfigs = injectPanelConfigsStore()
 strings = injectStringsStore()
 // panels = inject(PanelsStoreService)
 // strings = inject(StringsStoreService)
 }
 */
