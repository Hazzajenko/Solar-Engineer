/*
 import { APP_STATE_FEATURE_KEY, appStateReducer } from '@canvas/app/data-access'

 import { GRAPHICS_FEATURE_KEY, graphicsReducer } from '@canvas/graphics/data-access'
 import {
 OBJECT_POSITIONING_FEATURE_KEY,
 objectPositioningReducer,
 } from '@canvas/object-positioning/data-access'
 import { SELECTED_FEATURE_KEY, selectedReducer } from '@canvas/selected/data-access'
 import { WINDOWS_FEATURE_KEY, windowsReducer } from '@overlays/windows/data-access'
 import { provideState } from '@ngrx/store'
 import { UI_FEATURE_KEY, uiReducer } from '@overlays/ui-store/data-access'
 import { provideEffects } from '@ngrx/effects'
 import {
 providePanelConfigsFeature,
 providePanelLinksFeature,
 providePanelsFeature,
 provideStringsFeature,
 } from '@entities/data-access'
 import * as globalEffects from '../global/global.effects'
 import { KEYS_FEATURE_KEY, keysReducer } from '@canvas/keys/data-access'
 import {
 NOTIFICATIONS_FEATURE_KEY,
 notificationsReducer,
 } from '@overlays/notifications/data-access'
 import { makeEnvironmentProviders } from '@angular/core'

 const effectsProviders = [
 // provideEffects(panelsEffects),
 provideEffects(globalEffects), // provideEffects(stringsEffects),
 ] as const
 export const DesignAppNgrxStores = [
 provideState(APP_STATE_FEATURE_KEY, appStateReducer),
 provideState(UI_FEATURE_KEY, uiReducer),
 provideState(SELECTED_FEATURE_KEY, selectedReducer),
 provideState(OBJECT_POSITIONING_FEATURE_KEY, objectPositioningReducer),
 provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
 provideState(WINDOWS_FEATURE_KEY, windowsReducer),
 provideState(KEYS_FEATURE_KEY, keysReducer),
 provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
 providePanelsFeature(),
 provideStringsFeature(),
 providePanelConfigsFeature(),
 providePanelLinksFeature(),
 ...effectsProviders,
 ] as const

 export function provideCanvasAppStores() {
 return makeEnvironmentProviders([
 providePanelsFeature(),
 provideStringsFeature(),
 providePanelConfigsFeature(),
 providePanelLinksFeature(),
 provideState(APP_STATE_FEATURE_KEY, appStateReducer),
 provideState(UI_FEATURE_KEY, uiReducer),
 provideState(SELECTED_FEATURE_KEY, selectedReducer),
 provideState(OBJECT_POSITIONING_FEATURE_KEY, objectPositioningReducer),
 provideState(GRAPHICS_FEATURE_KEY, graphicsReducer),
 provideState(WINDOWS_FEATURE_KEY, windowsReducer),
 provideState(KEYS_FEATURE_KEY, keysReducer),
 provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
 ...effectsProviders,
 ])
 }
 */
