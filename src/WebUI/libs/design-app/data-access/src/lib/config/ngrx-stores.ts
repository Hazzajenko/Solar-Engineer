import { APP_STATE_FEATURE_KEY, appStateReducer } from '../app-store'
import {
	PANEL_CONFIGS_FEATURE_KEY,
	panelConfigsReducer,
	PANELS_FEATURE_KEY,
	panelsReducer,
	STRINGS_FEATURE_KEY,
	stringsReducer,
} from '../entities'
import { GRAPHICS_FEATURE_KEY, graphicsReducer } from '../graphics-store'
import {
	OBJECT_POSITIONING_FEATURE_KEY,
	objectPositioningReducer,
} from '../object-positioning-store'
import { SELECTED_FEATURE_KEY, selectedReducer } from '../selected'
import { WINDOWS_FEATURE_KEY, windowsReducer } from '../windows'
import { provideState } from '@ngrx/store'
import { UI_FEATURE_KEY, uiReducer } from '../ui-store'
import { provideEffects } from '@ngrx/effects'
import * as panelsEffects from '../entities/panels/panels.effects'
import * as stringsEffects from '../entities/strings/strings.effects'
import * as globalEffects from '../global/global.effects'
import { KEYS_FEATURE_KEY, keysReducer } from '../keys'
import { PANEL_LINKS_FEATURE_KEY, panelLinksReducer } from '../panel-links'
import { NOTIFICATIONS_FEATURE_KEY, notificationsReducer } from '../notifications'

const effectsProviders = [
	provideEffects(panelsEffects),
	provideEffects(globalEffects),
	provideEffects(stringsEffects),
] as const
export const DesignAppNgrxStores = [
	provideState(APP_STATE_FEATURE_KEY, appStateReducer),
	provideState(PANELS_FEATURE_KEY, panelsReducer),
	provideState(PANEL_CONFIGS_FEATURE_KEY, panelConfigsReducer),
	provideState(STRINGS_FEATURE_KEY, stringsReducer),
	provideState(PANEL_LINKS_FEATURE_KEY, panelLinksReducer),
	provideState(UI_FEATURE_KEY, uiReducer),
	provideState(SELECTED_FEATURE_KEY, selectedReducer),
	provideState(OBJECT_POSITIONING_FEATURE_KEY, objectPositioningReducer),
	provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
	provideState(WINDOWS_FEATURE_KEY, windowsReducer),
	provideState(KEYS_FEATURE_KEY, keysReducer),
	provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
	...effectsProviders,
] as const
