import { WindowsActions } from './windows.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { DraggableWindow } from '@shared/data-access/models'

export const WINDOWS_FEATURE_KEY = 'windows'

export interface WindowsState extends EntityState<DraggableWindow> {
	loaded: boolean
	error?: string | null
}

export const windowsAdapter: EntityAdapter<DraggableWindow> = createEntityAdapter<DraggableWindow>({
	selectId: (string) => string.id,
})

export const initialWindowsState: WindowsState = windowsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialWindowsState,
	on(WindowsActions.addWindow, (state, { window }) => windowsAdapter.addOne(window, state)),
	on(WindowsActions.updateWindow, (state, { update }) => windowsAdapter.updateOne(update, state)),
	on(WindowsActions.deleteWindow, (state, { windowId }) =>
		windowsAdapter.removeOne(windowId, state),
	),
	on(WindowsActions.clearWindowsState, () => initialWindowsState),
)

export function windowsReducer(state: WindowsState | undefined, action: Action) {
	return reducer(state, action)
}
