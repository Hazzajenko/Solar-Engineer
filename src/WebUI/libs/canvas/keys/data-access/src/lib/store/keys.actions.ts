import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { KeyMap } from '../types'

export const KeysActions = createActionGroup({
	source: 'Keys Store',
	events: {
		updateKeyMap: props<{
			keyMap: Partial<KeyMap>
		}>(),
		resetKeyMapToDefault: emptyProps(),
	},
})
