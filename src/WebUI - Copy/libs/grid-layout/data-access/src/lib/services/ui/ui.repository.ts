import { inject, Injectable } from '@angular/core'
import { ClientXY, GridLayoutXY, MouseXY, PosXY } from '../..'
import { Store } from '@ngrx/store'
import { UiActions } from '../../store'
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
    return this.store.dispatch(UiActions.toggleNavmenu())
  }

  togglePathLines() {
    return this.store.dispatch(UiActions.togglePathLines())
  }

  toggleStringStats() {
    return this.store.dispatch(UiActions.toggleStringStatistics())
  }

  setClientXY(clientXY: ClientXY) {
    return this.store.dispatch(UiActions.setClientxy({ clientXY }))
  }

  setWindowSize(windowSize: WindowSizeModel) {
    return this.store.dispatch(UiActions.setWindowSize({ windowSize }))
  }

  clearClientXY() {
    return this.store.dispatch(UiActions.clearClientxy())
  }

  setMouseXY(mouseXY: MouseXY) {
    return this.store.dispatch(UiActions.setMouseXy({ mouseXY }))
  }

  setScale(scale: number) {
    return this.store.dispatch(UiActions.setScale({ scale }))
  }

  keyPressed(key: string) {
    return this.store.dispatch(UiActions.keyPressed({ key }))
  }

  setPosXY(posXY: PosXY) {
    return this.store.dispatch(UiActions.setPosXy({ posXY }))
  }

  resetPosXY() {
    return this.store.dispatch(UiActions.resetPosXy())
  }

  resetMouseXY() {
    return this.store.dispatch(UiActions.resetMouseXy())
  }

  setGridlayoutZoom(zoom: number) {
    return this.store.dispatch(UiActions.setGridlayoutZoom({ zoom }))
  }

  resetGridlayoutZoom() {
    return this.store.dispatch(UiActions.resetGridlayoutZoom())
  }

  setGridlayoutComponentXy(gridLayoutXY: GridLayoutXY) {
    return this.store.dispatch(UiActions.setGridlayoutComponentXy({ gridLayoutXY }))
  }

  stopGridlayoutMoving() {
    return this.store.dispatch(UiActions.stopGridlayoutMoving())
  }

  resetGridlayoutComponentXy() {
    return this.store.dispatch(UiActions.resetGridlayoutComponentXy())
  }
}