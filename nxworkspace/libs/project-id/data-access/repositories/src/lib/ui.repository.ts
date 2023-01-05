import { inject, Injectable } from '@angular/core'
import { ClientXY, GridLayoutXY, MouseXY, PosXY } from '@grid-layout/shared/models'
import { Store } from '@ngrx/store'
import { UiActions } from '@project-id/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class UiRepository {
  private store = inject(Store)

  setClientXY(clientXY: ClientXY) {
    return this.store.dispatch(UiActions.setClientxy({ clientXY }))
  }

  clearClientXY() {
    return this.store.dispatch(UiActions.clearClientxy())
  }

  setMouseXY(mouseXY: MouseXY) {
    return this.store.dispatch(UiActions.setMouseXy({ mouseXY }))
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

  turnKeyMapOn() {
    return this.store.dispatch(UiActions.turnKeymapOn())
  }

  turnKeyMapOff() {
    return this.store.dispatch(UiActions.turnKeymapOff())
  }


}
