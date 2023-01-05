import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { UiActions, UiSelectors } from '@project-id/data-access/store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UiFacade {
  private store = inject(Store)

  isKeyMapEnabled$ = this.store.select(UiSelectors.selectIsKeymapEnabled)
  gridLayoutMoving$ = this.store.select(UiSelectors.selectGridLayoutMoving)
  gridLayoutXY$ = this.store.select(UiSelectors.selectGridLayoutXY)
  mouseXY$ = this.store.select(UiSelectors.selectMouseXY)
  posXY$ = this.store.select(UiSelectors.selectPosXY)
  gridLayoutZoom$ = this.store.select(UiSelectors.selectGridLayoutZoom)
  clientXY$ = this.store.select(UiSelectors.selectClientXY)

  get isKeyMapEnabled() {
    return firstValueFrom(this.isKeyMapEnabled$)
  }

  get mouseXY() {
    return firstValueFrom(this.mouseXY$)
  }

  get posXY() {
    return firstValueFrom(this.posXY$)
  }

  get gridLayoutMoving() {
    return firstValueFrom(this.gridLayoutMoving$)
  }

  get gridLayoutXY() {
    return firstValueFrom(this.gridLayoutXY$)
  }

  get gridLayoutZoom() {
    return firstValueFrom(this.gridLayoutZoom$)
  }

  get clientXY() {
    return firstValueFrom(this.clientXY$)
  }

  toggleKeyMap() {
    this.store.dispatch(UiActions.toggleKeymap())
  }

  turnKeyMapOn() {
    this.store.dispatch(UiActions.turnKeymapOn())
  }

  turnKeyMapOff() {
    this.store.dispatch(UiActions.turnKeymapOff())
  }
}
