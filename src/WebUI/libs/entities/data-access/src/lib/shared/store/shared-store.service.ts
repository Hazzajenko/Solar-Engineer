import { Injectable } from '@angular/core'
import { injectPanelsStore } from '../../panels'
import { injectStringsStore } from '../../strings'
import { injectPanelLinksStore } from '../../panel-links'
import { injectPanelConfigsStore } from '../../panel-configs'

@Injectable({
	providedIn: 'root',
})
export class EntityStoreService {
	panels = injectPanelsStore()
	panelLinks = injectPanelLinksStore()
	panelConfigs = injectPanelConfigsStore()
	// panels = inject(PanelsStoreService)
	strings = injectStringsStore()
	// strings = inject(StringsStoreService)
}
