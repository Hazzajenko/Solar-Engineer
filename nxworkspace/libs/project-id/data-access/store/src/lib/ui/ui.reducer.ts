import { Action, createReducer, on } from '@ngrx/store'

import { UiActions } from './ui.actions'

export const UI_FEATURE_KEY = 'ui'


export interface UiState {
  keymap: boolean
}

export const initialUiState: UiState = {
  keymap: true,
}


const reducer = createReducer(
  initialUiState,
  on(UiActions.toggleKeymap, (state) => ({ ...state, keymap: !state.keymap })),
  on(UiActions.turnKeymapOn, (state) => ({ ...state, keymap: true })),
  on(UiActions.turnKeymapOff, (state) => ({ ...state, keymap: false })),
)

export function uiReducer(state: UiState | undefined, action: Action) {
  return reducer(state, action)
}
