import { Action, createReducer, on } from '@ngrx/store'
import { KeysActions } from './keys.actions'
import { DEFAULT_KEY_MAP, KeyMap } from '../types'

export const KEYS_FEATURE_KEY = 'keys'

export type KeysState = {
	keyMap: KeyMap
}

export const initialKeysState: KeysState = {
	keyMap: DEFAULT_KEY_MAP,
}

const reducer = createReducer(
	initialKeysState,
	on(KeysActions.updateKeyMap, (state, { keyMap }) => ({
		...state,
		keyMap: {
			...state.keyMap,
			...keyMap,
		},
	})),
	on(KeysActions.resetKeyMapToDefault, () => initialKeysState),
)

export function keysReducer(state: KeysState | undefined, action: Action) {
	return reducer(state, action)
}
