import { KeyCategory } from './key-category'
import {
	CopyPasteKeys,
	GridKeys,
	ObjectPositionKeys,
	StateManageKeys,
	ViewPositionKeys,
} from './key-types'

export type KeyMapKey = {
	key: string
	label: string
	category: KeyCategory
}

export const KeyMapKeys: KeyMapKey[] = [
	...CopyPasteKeys,
	...StateManageKeys,
	...ObjectPositionKeys,
	...ViewPositionKeys,
	...GridKeys,
]