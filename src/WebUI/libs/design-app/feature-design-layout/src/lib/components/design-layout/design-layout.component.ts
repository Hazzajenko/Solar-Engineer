import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { map } from 'rxjs'
import { PanelsStoreService } from '@design-app/feature-panel'
import { DesignLayoutDirective } from './design-layout.directive'
import { KeyUpDirective } from '../../directives/key-up.directive'
import { ScrollViewDirective } from '../../directives/scroll-view.directive'
import { DynamicComponentDirective } from '../../directives/dynamic-component.directive'
import { ShowScreenPositionComponent } from './show-screen-position/show-screen-position.component'

// import { ShowScreenPositionComponent } from '@design-app/view-positioning'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [
    CdkDrag,
    CommonModule,
    DesignLayoutDirective,
    ScrollViewDirective,
    DynamicComponentDirective,
    ShowScreenPositionComponent,
  ],
  hostDirectives:  [
    KeyUpDirective,
  ],
  selector:        'app-design-layout',
  standalone:      true,
  styles:          [
    `
      .appScrollView {
        -webkit-transform-origin: 0 0;
      }
    `,
  ],
  templateUrl:     './design-layout.component.html',
})
export class DesignLayoutComponent
  implements OnInit {
  private _panelsStore = inject(PanelsStoreService)
  // private _designPanelsFacade = inject(DesignPanelsFacade)
  panels$ = this._panelsStore.select.panels$.pipe(
    map((panels) => {
        console.log('panels', panels)
        return panels.map((panel) => {
            return {
              id:   panel.id,
              type: panel.type,
            }
          },
        )
      },
    ),
  )
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
    /*    this.layoutWidthString = this.screenSizeToPxString(this.layoutWidth)
     this.layoutHeightString = this.screenSizeToPxString(this.layoutHeight)
     this.backgroundHeight = this.screenSizeToPxString(this.layoutHeight + 1)
     this.backgroundWidth = this.screenSizeToPxString(this.layoutWidth + 1)*/
    this.layoutWidthString = `${this.layoutWidth}px`
    this.layoutHeightString = `${this.layoutHeight}px`
    this.backgroundHeight = `${this.layoutHeight + 1}px`
    this.backgroundWidth = `${this.layoutWidth + 1}px`
    this.getScreenWidth = window.innerWidth
    this.getScreenHeight = window.innerHeight
    /*    this.gridContainerWidth = `${window.innerWidth - 100}px`
     this.gridContainerHeight = `${window.innerHeight - 100}px`*/
    // this.gridContainerWidth = this.screenSizeToPxString(window.innerWidth - 100)
    // this.gridContainerHeight = this.screenSizeToPxString(window.innerHeight - 100)
    this.gridContainerWidth = `${window.innerWidth - 100}px`
    this.gridContainerHeight = `${window.innerHeight - 100}px`
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
