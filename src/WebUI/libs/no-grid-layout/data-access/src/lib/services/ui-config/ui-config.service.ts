import { Injectable } from '@angular/core'
import { CanvasConfig, ShowScreenPositionConfig, ShowScreenPositionMode } from '@no-grid-layout/shared'

@Injectable({
  providedIn: 'root',
})
export class UiConfigService {
  public showScreenPositionConfig: ShowScreenPositionConfig = {
    mode:           ShowScreenPositionMode.ShowOnlyOnChanges,
    onChangesTimer: 3000,
  }
  public canvasConfig: CanvasConfig = {
    showDirectionLines: true,
    showLineDistance:   false,
    font:               '12px Arial',
    fillStyle:          '#d6352e',
    // fillStyle: '#7585d8',
    // strokeStyle: '#3549ff',
    strokeStyle: '#ff6d75',
    globalAlpha: 1,
    lineWidth:   1,
  }
}