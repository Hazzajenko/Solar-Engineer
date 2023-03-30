import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit } from '@angular/core'
import { FreePanelModel } from './free-panel.model'
import { FreePanelComponent } from './components/free-panel-component/free-panel.component'
import { CommonModule } from '@angular/common'
import { NoGridLayoutDirective } from './no-grid-layout.directive'
import { NoGridLayoutService } from './no-grid-layout.service'
import { CdkDrag, CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FreePanelComponent,
    CdkDrag,
    CommonModule,
    NoGridLayoutDirective,
  ],
  selector: 'app-no-grid-layout',
  standalone: true,
  styles: [],

  templateUrl: './no-grid-layout.component.html',
})
export class NoGridLayoutComponent implements OnInit {
  private elementRef = inject(ElementRef<NoGridLayoutComponent>)
  private noGridLayoutService = inject(NoGridLayoutService)
  freePanels$ = this.noGridLayoutService.getFreePanels()
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
    console.log('window.innerWidth', window.innerWidth)
    console.log('window.innerHeight', window.innerHeight)
    this.gridContainerWidth = `${window.innerWidth - 100}px`
    this.gridContainerHeight = `${window.innerHeight - 100}px`
    // this.gridContainerWidth = `${window.innerWidth - 400}px`
    // this.gridContainerHeight = `${window.innerHeight - 400}px`
    console.log('this.gridContainerWidth', this.gridContainerWidth)
    console.log('this.gridContainerHeight', this.gridContainerHeight)

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

  /*createFreePanel(event: MouseEvent) {
   event.preventDefault()
   const rect = this.elementRef.nativeElement.getBoundingClientRect()
   console.log('rect', rect)
   // this.dragPosition = { x: this.freePanel.x, y: this.freePanel.y }
   // const mouseX = this.pageX - rect.left
   // const mouseY = this.pageY - rect.top
   // this.pageX = event.pageX
   // this.pageY = event.pageY
   // const rect = this.canvas.nativeElement.getBoundingClientRect()

   const mouseX = event.pageX - rect.left
   const mouseY = event.pageY - rect.top
   // this.startX = event.clientX - rect.left
   // this.startY = event.clientY - rect.top
   const freePanel: FreePanelModel = {
   id: this.freePanels.length.toString(),
   location: {
   x: mouseX,
   y: mouseY,
   },
   /!*      x: mouseX,
   y: mouseY,*!/
   }
   /!*    this.freePanels.push(freePanel,
   )*!/
   this.noGridLayoutService.addFreePanel(freePanel)
   console.log('freePanel', freePanel)

   }*/

  dragDropped(event: CdkDragDrop<FreePanelModel>) {
    // event.preventDefault()
    console.log('dragDropped', event)

  }

  dragMoved(event: CdkDragMove<FreePanelModel>) {
    // event.preventDefault()
    // console.log('dragMoved', event)
    // this.savedPosition = { x: event.source.getFreeDragPosition().x, y: event.source.getFreeDragPosition().y }
    // console.log('savedPosition', this.savedPosition)
  }
}
