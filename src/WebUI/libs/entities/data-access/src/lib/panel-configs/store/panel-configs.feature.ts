import { makeEnvironmentProviders } from '@angular/core'
import { PANEL_CONFIGS_FEATURE_KEY, panelConfigsReducer } from '@entities/data-access'
import { provideState } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import * as PanelConfigsEffects from './panel-configs.effects'

export function providePanelConfigsFeature() {
	return makeEnvironmentProviders([
		provideState(PANEL_CONFIGS_FEATURE_KEY, panelConfigsReducer),
		provideEffects(PanelConfigsEffects),
	])
}
