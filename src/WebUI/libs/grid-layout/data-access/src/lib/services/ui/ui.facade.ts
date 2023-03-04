import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { UiSelectors } from '../../store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UiFacade {
  private store = inject(Store)

  isKeyMapEnabled$ = this.store.select(UiSelectors.selectIsKeymapEnabled)
  windowSize$ = this.store.select(UiSelectors.selectWindowSize)
  navMenuState$ = this.store.select(UiSelectors.selectNavMenuState)
  isPathLinesEnabled$ = this.store.select(UiSelectors.selectIsPathLinesEnabled)
  isStringStatsEnabled$ = this.store.select(UiSelectors.selectIsStringStatsEnabled)
  gridLayoutMoving$ = this.store.select(UiSelectors.selectGridLayoutMoving)
  gridLayoutXY$ = this.store.select(UiSelectors.selectGridLayoutXY)
  mouseXY$ = this.store.select(UiSelectors.selectMouseXY)
  posXY$ = this.store.select(UiSelectors.selectPosXY)
  gridLayoutZoom$ = this.store.select(UiSelectors.selectGridLayoutZoom)
  clientXY$ = this.store.select(UiSelectors.selectClientXY)
  keyPressed$ = this.store.select(UiSelectors.selectKeyPressed)
  scale$ = this.store.select(UiSelectors.selectScale)

  get isKeyMapEnabled() {
    return firstValueFrom(this.isKeyMapEnabled$)
  }

  get windowSize() {
    return firstValueFrom(this.windowSize$)
  }

  get navMenuState() {
    return firstValueFrom(this.navMenuState$)
  }

  get isPathLinesEnabled() {
    return firstValueFrom(this.isPathLinesEnabled$)
  }

  get isStringStatsEnabled() {
    return firstValueFrom(this.isStringStatsEnabled$)
  }

  get scale() {
    return firstValueFrom(this.scale$)
  }

  get keyPressed() {
    return firstValueFrom(this.keyPressed$)
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

}
