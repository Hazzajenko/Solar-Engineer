import { makeEnvironmentProviders } from '@angular/core'
import { providePanelsFeature } from '../../panels'
import { provideStringsFeature } from '../../strings'
import { providePanelConfigsFeature } from '../../panel-configs'
import { providePanelLinksFeature } from '../../panel-links'

export function provideEntityStores() {
	return makeEnvironmentProviders([
		providePanelsFeature(),
		provideStringsFeature(),
		providePanelConfigsFeature(),
		providePanelLinksFeature(), // provideEffects({ renderCanvasOnEntityStateChanges$ }),
	])
}
