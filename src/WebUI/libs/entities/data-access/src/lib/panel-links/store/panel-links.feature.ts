import { makeEnvironmentProviders } from '@angular/core'
import { provideState } from '@ngrx/store'
import { PANEL_LINKS_FEATURE_KEY, panelLinksReducer } from './panel-links.reducer'
import * as panelLinksEffects from './panel-links.effects'
import * as panelLinksSignalrEffects from './panel-links.signalr.effects'
import * as panelLinksLocalStorageEffects from './panel-links.local-storage.effects'
import { provideEffects } from '@ngrx/effects'

export function providePanelLinksFeature() {
	return makeEnvironmentProviders([
		provideState(PANEL_LINKS_FEATURE_KEY, panelLinksReducer),
		provideEffects(panelLinksEffects),
		provideEffects(panelLinksSignalrEffects, panelLinksLocalStorageEffects),
	])
}
