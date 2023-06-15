import { createFeature, provideState } from '@ngrx/store'
import { makeEnvironmentProviders } from '@angular/core'
import { UI_FEATURE_KEY, uiReducer } from './ui.reducer'

export const uiFeature = createFeature({
	name: UI_FEATURE_KEY,
	reducer: uiReducer,
	extraSelectors: ({
		selectUiState,
		selectCurrentContextMenu,
		selectCurrentDialog,
		selectSideUiNavOpen,
		selectSideUiMobileMenuOpen,
	}) => ({
		selectUiState,
		selectCurrentContextMenu,
		selectCurrentDialog,
		selectSideUiNavOpen,
		selectSideUiMobileMenuOpen,
	}),
})

export function provideUiFeature() {
	return makeEnvironmentProviders([provideState(uiFeature)])
}
