import { Injectable } from '@angular/core'
import { ShowScreenPositionConfig, ShowScreenPositionMode } from '@no-grid-layout/shared'

@Injectable({
  providedIn: 'root',
})
export class UiOverlayService {
  public showScreenPositionMode: ShowScreenPositionConfig = {
    mode:           ShowScreenPositionMode.ShowOnlyOnChanges,
    onChangesTimer: 3000,
  }
}