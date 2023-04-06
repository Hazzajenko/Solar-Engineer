import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { FreePanelComponent } from './components/free-panel-component/free-panel.component'
import { CommonModule } from '@angular/common'
import { NoGridLayoutDirective } from './directives/no-grid-layout.directive'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'
import { AppGridBackgroundDirective } from './directives/app-grid-background.directive'
import { FreePanelsService } from '@no-grid-layout/data-access'
import { NoGridBackgroundComponent } from './ui/no-grid-background.component'
import { map } from 'rxjs'
import { ScrollDirective } from './directives/scroll.directive'
import { KeyUpDirective } from './directives/key-up.directive'
import { ShowScreenPositionComponent } from './ui/show-screen-position/show-screen-position.component'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [
    FreePanelComponent,
    CdkDrag,
    CommonModule,
    NoGridLayoutDirective,
    DynamicComponentDirective,
    DynamicComponentDirective,
    AppGridBackgroundDirective,
    NoGridBackgroundComponent,
    ScrollDirective,
    KeyUpDirective,
    ShowScreenPositionComponent,
  ],
  selector:        'app-no-grid-layout',
  standalone:      true,
  styles:          [],
  templateUrl:     './no-grid-layout.component.html',
})
export class NoGridLayoutComponent
  implements OnInit {
  private _freePanelsService = inject(FreePanelsService)
  panels$ = this._freePanelsService.getFreePanels$()
  freePanels$ = this._freePanelsService.getFreePanels$()
    .pipe(
      map((freePanels) => {
          console.log('freePanels', freePanels)
          return freePanels.map((freePanel) => {
            return {
              id:   freePanel.id,
              type: freePanel.type,
            }
          })
        },
      ))
  getScreenWidth!: number
  getScreenHeight!: number
  gridContainerWidth!: string
  gridContainerHeight!: string
  layoutWidth!: number
  layoutHeight!: number
  layoutWidthString!: string
  layoutHeightString!: string
  blockHeight = 32
  blockWidth = 32
  backgroundHeight?: string
  backgroundWidth?: string
  rows!: number
  cols!: number
  screenHasBeenSet = false

  // trackByPanelId: any

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit')
    this.initScreenSize()
  }

  trackByPanelId(index: any, panel: {
    id: string
  }) {
    return panel.id
  }

  initScreenSize() {
    this.rows = Math.floor((window.innerHeight - 100) / this.blockHeight)
    this.cols = Math.floor((window.innerWidth - 100) / this.blockWidth)
    this.layoutHeight = this.rows * this.blockHeight
    this.layoutWidth = this.cols * this.blockWidth
    /*    this.layoutWidthString = `${this.layoutWidth}px`
     this.layoutHeightString = `${this.layoutHeight}px`
     this.backgroundHeight = `${this.layoutHeight + 1}px`
     this.backgroundWidth = `${this.layoutWidth + 1}px`*/
    this.layoutWidthString = this.screenSizeToPxString(this.layoutWidth)
    this.layoutHeightString = this.screenSizeToPxString(this.layoutHeight)
    this.backgroundHeight = this.screenSizeToPxString(this.layoutHeight + 1)
    this.backgroundWidth = this.screenSizeToPxString(this.layoutWidth + 1)
    this.getScreenWidth = window.innerWidth
    this.getScreenHeight = window.innerHeight
    /*    this.gridContainerWidth = `${window.innerWidth - 100}px`
     this.gridContainerHeight = `${window.innerHeight - 100}px`*/
    this.gridContainerWidth = this.screenSizeToPxString(window.innerWidth - 100)
    this.gridContainerHeight = this.screenSizeToPxString(window.innerHeight - 100)
    this.screenHasBeenSet = true
  }

  onResize(event: any) {
    this.initScreenSize()
  }

  log(log: string) {
    console.log(log)
  }

  private screenSizeToPxString(size: number) {
    return `${size}px`
  }

}
