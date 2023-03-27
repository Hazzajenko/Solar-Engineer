import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FreePanelModel } from './free-panel.model'
import { FreePanelComponent } from './components/free-panel-component/free-panel.component'
import { CommonModule } from '@angular/common'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FreePanelComponent,
    CommonModule
  ],
  selector: 'app-no-grid-layout',
  standalone: true,
  styles: [],

  templateUrl: './no-grid-layout.component.html',
})
export class NoGridLayoutComponent implements OnInit {
  freePanels: FreePanelModel[] = []
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
    this.initScreenSize()
  }

  initScreenSize() {
    this.getScreenWidth = window.innerWidth
    this.getScreenHeight = window.innerHeight
    this.gridContainerWidth = `${window.innerWidth - 100}px`
    this.gridContainerHeight = `${window.innerHeight - 100}px`
    /*    this.rows = Math.floor((this.getScreenHeight - 100) / this.blockHeight)
     this.cols = Math.floor((this.getScreenWidth - 100) / this.blockWidth)
     this.layoutHeight = this.rows * this.blockHeight
     this.layoutWidth = this.cols * this.blockWidth
     this.layoutWidthString = `${this.layoutWidth}px`
     this.layoutHeightString = `${this.layoutHeight}px`
     this.backgroundHeight = `${this.layoutHeight + 1}px`
     this.backgroundWidth = `${this.layoutWidth + 1}px`*/
    this.screenHasBeenSet = true
  }

  createFreePanel(event: MouseEvent) {
    event.preventDefault()
    this.freePanels.push({
        id: this.freePanels.length.toString(),
        x: event.clientX,
        y: event.clientY,
      },
    )

  }
}
