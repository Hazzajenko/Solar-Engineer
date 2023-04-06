import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ScreenMoveService } from '@no-grid-layout/utils'
import { ShowScreenPositionMode } from '@no-grid-layout/shared'
import { BehaviorSubject, tap } from 'rxjs'
import { LetModule } from '@ngrx/component'
import { UiOverlayService } from '@no-grid-layout/data-access'

@Component({
  selector:        'app-show-screen-position',
  standalone:      true,
  imports:         [
    CommonModule,
    LetModule,
  ],
  templateUrl:     './show-screen-position.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles:          [],
})
export class ShowScreenPositionComponent {
  private _screenMoveService = inject(ScreenMoveService)
  private _uiOverlayService = inject(UiOverlayService)

  scale$ = this._screenMoveService.scale$.pipe(
    tap(() => {
      switch (this._uiOverlayService.showScreenPositionMode.mode) {
        case ShowScreenPositionMode.ShowOnlyOnChanges:
          this.handleOnChangesTimer()
          break
        case ShowScreenPositionMode.ShowAlways:
          this._canShow.next(true)
          break
        case ShowScreenPositionMode.ShowNever:
          this._canShow.next(false)
          break
      }
    }),
  )

  showTimer: NodeJS.Timer | undefined = undefined
  canShow = false
  _canShow = new BehaviorSubject(false)
  canShow$ = this._canShow.asObservable()
  showMode: ShowScreenPositionMode = ShowScreenPositionMode.ShowAlways

  private handleOnChangesTimer() {
    this._canShow.next(true)
    setTimeout(() => {
      this._canShow.next(false)
    }, this._uiOverlayService.showScreenPositionMode.onChangesTimer)

  }

}