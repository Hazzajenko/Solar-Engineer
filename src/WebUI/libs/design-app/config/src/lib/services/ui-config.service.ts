import { Injectable } from '@angular/core'
import { ShowScreenPositionConfig, ShowScreenPositionMode } from 'design-app/utils'

@Injectable({
  providedIn: 'root',
})
export class UiConfigService {
  public showScreenPositionConfig: ShowScreenPositionConfig = {
    mode:           ShowScreenPositionMode.ShowOnlyOnChanges,
    onChangesTimer: 3000,
  }
  // public canvasConfig: CanvasConfig = {
  public canvasConfig = {
    showDirectionLines: false,
    stopLineAtPanel:    false,
    showGridAxisLines:  true,
    // stopLineAtPanel:    true,
    showLineDistance:     false,
    lightUpClosestPanels: false,
    font:                 '12px Arial',
    fillStyle:            '#d6352e',
    // fillStyle: '#7585d8',
    // strokeStyle: '#3549ff',
    strokeStyle: '#ff6d75',
    globalAlpha: 1,
    lineWidth:   1,
  }
}