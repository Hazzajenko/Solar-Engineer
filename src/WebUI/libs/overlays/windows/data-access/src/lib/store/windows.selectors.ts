import { WINDOWS_FEATURE_KEY, windowsAdapter, WindowsState } from './windows.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { DraggableWindow } from '@shared/data-access/models'

export const selectWindowsState = createFeatureSelector<WindowsState>(WINDOWS_FEATURE_KEY)

const { selectAll, selectEntities } = windowsAdapter.getSelectors()

export const selectAllWindows = createSelector(selectWindowsState, (state: WindowsState) =>
	selectAll(state),
)

export const selectWindowsEntities = createSelector(selectWindowsState, (state: WindowsState) =>
	selectEntities(state),
)

export const selectAllOpenWindows = createSelector(selectAllWindows, (windows: DraggableWindow[]) =>
	windows.filter((window) => window.isOpen),
)

export const selectAllClosedWindows = createSelector(
	selectAllWindows,
	(windows: DraggableWindow[]) => windows.filter((window) => !window.isOpen),
)
export const selectWindowById = (props: { id: string }) =>
	createSelector(selectAllWindows, (windows: DraggableWindow[]) =>
		windows.find((window) => window.id === props.id),
	)
