import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

export const SELECTED_PROJECT_VIEW = {
	PROFILE: 'profile',
	DATA: 'data',
	MEMBERS: 'members',
	SETTINGS: 'settings',
} as const

export type SelectedProjectView = (typeof SELECTED_PROJECT_VIEW)[keyof typeof SELECTED_PROJECT_VIEW]

export type SelectedProjectViewStoreState = {
	selectedProjectView: SelectedProjectView
}

@Injectable({
	providedIn: 'root',
})
export class SelectedProjectViewStore extends ComponentStore<SelectedProjectViewStoreState> {
	private readonly _setSelectedProjectView = this.updater(
		(state, selectedProjectView: SelectedProjectView) => {
			return {
				...state,
				selectedProjectView,
			}
		},
	)
	readonly selectedProjectView = this.selectSignal((state) => state.selectedProjectView)
	setSelectedProjectView = (selectedProjectView: SelectedProjectView) => {
		this._setSelectedProjectView(selectedProjectView)
	}

	constructor() {
		super({
			selectedProjectView: 'profile',
		})
	}
}
