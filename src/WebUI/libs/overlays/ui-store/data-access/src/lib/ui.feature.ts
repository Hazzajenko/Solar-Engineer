import { createFeature, createSelector, provideState } from '@ngrx/store'
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
		selectScreenSize,
	}) => ({
		selectUiState,
		selectCurrentContextMenu,
		selectCurrentDialog,
		selectSideUiNavOpen,
		selectSideUiMobileMenuOpen,
		selectScreenSize,
		selectIsMobile: createSelector(selectScreenSize, (screenSize) => screenSize?.width < 768),
	}),
})

export function provideUiFeature() {
	return makeEnvironmentProviders([provideState(uiFeature)])
}
