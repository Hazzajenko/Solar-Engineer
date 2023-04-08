import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BehaviorSubject, tap } from 'rxjs'
import { LetModule } from '@ngrx/component'
import { UiConfigService } from '@design-app/config'
import { ShowScreenPositionMode, ViewPositioningService } from 'design-app/utils'

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
  private _viewPositioningService = inject(ViewPositioningService)
  private _uiOverlayService = inject(UiConfigService)

  scale$ = this._viewPositioningService.scale$.pipe(
    tap(() => {
      switch (this._uiOverlayService.showScreenPositionConfig.mode) {
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
    }, this._uiOverlayService.showScreenPositionConfig.onChangesTimer)

  }

}