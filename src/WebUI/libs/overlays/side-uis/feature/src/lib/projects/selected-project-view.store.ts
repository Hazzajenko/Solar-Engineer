import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

export const SELECTED_PROJECT_VIEW = {
	DATA: 'data',
	MEMBERS: 'members',
	SETTINGS: 'settings',
} as const

export type SelectedProjectView = (typeof SELECTED_PROJECT_VIEW)[keyof typeof SELECTED_PROJECT_VIEW]

export type SelectedProjectViewStoreState = {
	selectedProjectView: SelectedProjectView
	// cachedSelectedProjectView?: SelectedProjectView
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
	// private readonly _selectedProjectView = this.selectSignal((state) => state.selectedProjectView)
	readonly selectedProjectView = this.selectSignal((state) => state.selectedProjectView)
	/*	readonly selectedProjectView = () => {
	 const view = this._selectedProjectView()
	 console.log('selectedProjectView', view)
	 if (view === 'none' && this._cachedSelectedProjectView()) {
	 this.patchState((state) => ({
	 selectedProjectView: state.cachedSelectedProjectView,
	 }))
	 }
	 return this._selectedProjectView()
	 }*/

	/*	readonly enableCachedSelectedProjectView = this.effect((trigger$) => {
	 return trigger$.pipe(
	 tap(() => {
	 const cachedSelectedProjectView = this._cachedSelectedProjectView()
	 if (cachedSelectedProjectView) {
	 this.patchState(() => ({
	 selectedProjectView: cachedSelectedProjectView,
	 }))
	 }
	 }),
	 )
	 })*/

	/*	readonly enableCachedSelectedProjectView = () =>
	 this.patchState((state) => {
	 return {
	 selectedProjectView: state.cachedSelectedProjectView,
	 }
	 })*/

	setSelectedProjectView = (selectedProjectView: SelectedProjectView) => {
		this._setSelectedProjectView(selectedProjectView)
	}

	constructor() {
		super({
			selectedProjectView: 'members', // cachedSelectedProjectView: 'data',
		})
	}
}
