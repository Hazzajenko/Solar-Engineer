import { createFeatureSelector, createSelector } from '@ngrx/store'
import { KEYS_FEATURE_KEY, KeysState } from './keys.reducer'
import { reverseRecord } from '@shared/utils'
import { Key } from '@shared/data-access/models'
import { KeyMapAction } from './key-map'

export const selectKeysState = createFeatureSelector<KeysState>(KEYS_FEATURE_KEY)

export const selectKeyMap = createSelector(selectKeysState, (state: KeysState) => state.keyMap)

export const selectKeyMapValues = createSelector(
	selectKeysState,
	(state: KeysState) => reverseRecord(state.keyMap) as Record<Key, KeyMapAction>,
)
