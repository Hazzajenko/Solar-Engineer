import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { SideUiNavBarView } from '@overlays/side-uis/feature'

export type SideUiNavBarStoreState = {
	currentView: SideUiNavBarView
}

@Injectable({
	providedIn: 'root',
})
export class SideUiNavBarStore extends ComponentStore<SideUiNavBarStoreState> {
	readonly currentView = this.selectSignal((state) => state.currentView)

	readonly changeView = this.updater((state, view: SideUiNavBarView) => {
		return {
			...state,
			currentView: view,
		}
	})

	constructor() {
		super({
			currentView: 'auth',
		})
	}
}
