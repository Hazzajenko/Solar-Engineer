import { ClientXY, GridLayoutXY, MouseXY, PosXY } from '../..'
import { UiActions } from '../../store'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { WindowSizeModel } from '@shared/data-access/models'


@Injectable({
	providedIn: 'root',
})
export class UiRepository {
	private store = inject(Store)
	toggleCreateProjectOverlayTimer = 0
	toggleNavManuTimer = 0

	toggleKeyMap() {
		return this.store.dispatch(UiActions.toggleKeymap())
	}

	toggleCreateProjectOverlay() {
		if (this.toggleCreateProjectOverlayTimer > 0) return
		this.toggleCreateProjectOverlayTimer = 5
		this.store.dispatch(UiActions.toggleCreateProjectOverlay())
		setInterval(() => {
			if (this.toggleCreateProjectOverlayTimer > 0) {
				console.log(this.toggleCreateProjectOverlayTimer)
				this.toggleCreateProjectOverlayTimer--
			}
		}, 500)
		return
	}

	toggleNavMenu() {
		/*   if (this.toggleNavManuTimer > 0) return
		 this.toggleNavManuTimer = 5
		 this.store.dispatch(UiActions.toggleNavmenu())
		 setInterval(() => {
		 if (this.toggleNavManuTimer > 0) {
		 console.log(this.toggleNavManuTimer)
		 this.toggleNavManuTimer--
		 }
		 }, 500)
		 return*/
		return this.store.dispatch(UiActions.toggleNavMenu())
	}

	togglePathLines() {
		return this.store.dispatch(UiActions.togglePathLines())
	}

	toggleStringStats() {
		return this.store.dispatch(UiActions.toggleStringStatistics())
	}

	setClientXY(clientXY: ClientXY) {
		return this.store.dispatch(UiActions.setClientXY({ clientXY }))
	}

	setWindowSize(windowSize: WindowSizeModel) {
		return this.store.dispatch(UiActions.setWindowSize({ windowSize }))
	}

	clearClientXY() {
		return this.store.dispatch(UiActions.clearClientXY())
	}

	setMouseXY(mouseXY: MouseXY) {
		return this.store.dispatch(UiActions.setMouseXY({ mouseXY }))
	}

	setScale(scale: number) {
		return this.store.dispatch(UiActions.setScale({ scale }))
	}

	keyPressed(key: string) {
		return this.store.dispatch(UiActions.keyPressed({ key }))
	}

	setPosXY(posXY: PosXY) {
		return this.store.dispatch(UiActions.setPosXY({ posXY }))
	}

	resetPosXY() {
		return this.store.dispatch(UiActions.resetPosXY())
	}

	resetMouseXY() {
		return this.store.dispatch(UiActions.resetMouseXY())
	}

	setGridlayoutZoom(zoom: number) {
		return this.store.dispatch(UiActions.setGridLayoutZoom({ zoom }))
	}

	resetGridlayoutZoom() {
		return this.store.dispatch(UiActions.resetGridLayoutZoom())
	}

	setGridlayoutComponentXy(gridLayoutXY: GridLayoutXY) {
		return this.store.dispatch(UiActions.setGridLayoutComponentXY({ gridLayoutXY }))
	}

	stopGridlayoutMoving() {
		return this.store.dispatch(UiActions.stopGridLayoutMoving())
	}

	resetGridlayoutComponentXy() {
		return this.store.dispatch(UiActions.resetGridLayoutComponentXY())
	}
}