import { Key, KEYS } from '@shared/data-access/models'

export const KEY_MAP_ACTION = {
	CREATE_STRING_WITH_SELECTED: 'CREATE_STRING_WITH_SELECTED',
	START_ROTATE_MODE: 'START_ROTATE_MODE',
	TOGGLE_MODE: 'TOGGLE_MODE',
} as const

export type KeyMapAction = (typeof KEY_MAP_ACTION)[keyof typeof KEY_MAP_ACTION]

export const DEFAULT_KEY_MAP: KeyMap = {
	[KEY_MAP_ACTION.CREATE_STRING_WITH_SELECTED]: KEYS.C,
	[KEY_MAP_ACTION.START_ROTATE_MODE]: KEYS.R,
	[KEY_MAP_ACTION.TOGGLE_MODE]: KEYS.M,
}

export type KeyMap = {
	[key in KeyMapAction]: Key
}

type KeyMapValues = KeyMap[keyof KeyMap]

export const getKeyMapValues = (keyMap: KeyMap) => Object.values(keyMap) as KeyMapValues[]
export const getKeyMapKeys = (keyMap: KeyMap) => Object.keys(keyMap) as KeyMapAction[]
// export type KeyMap = typeof DEFAULT_KEY_MAP

// export const KEY_MAP_ACTION_REVERSE = reverseRecord(DEFAULT_KEY_MAP) as Record<Key, KeyMapAction>
// const what = KEY_MAP_ACTION_REVERSE[KEYS.C]
