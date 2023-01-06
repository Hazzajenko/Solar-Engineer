import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit, Renderer2,
  ViewChild,
} from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ClickService, DropService, MouseService } from '@grid-layout/data-access/services'
import { MouseEventRequest } from '@grid-layout/data-access/utils'
import { KeymapOverlayComponent } from '@grid-layout/feature/keymap'
import { StringTotalsOverlayComponent } from '@grid-layout/feature/string-stats'
import { ElementOffsets, GridLayoutXY, MouseXY } from '@grid-layout/shared/models'
import { LetModule } from '@ngrx/component'
import { GridFacade, SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { BlockModel, StringModel } from '@shared/data-access/models'
import { DoubleClickService } from 'libs/grid-layout/data-access/services/src/lib/double-click.service'
import { MoveService } from 'libs/grid-layout/data-access/services/src/lib/move.service'
import { WrapperDirective } from 'libs/grid-layout/feature/index/src/lib/directives/wrapper.directive'
import { GridBackgroundComponent } from 'libs/grid-layout/feature/index/src/lib/ui/grid-background.component'
import { UiFacade } from 'libs/project-id/data-access/facades/src/lib/ui.facade'
import { Observable, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'
import { number } from 'ts-pattern/dist/patterns'
import { CanvasDirective } from './directives/canvas.directive'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'
import { GridDirective } from './directives/grid.directive'
import { KeyMapDirective } from './directives/key-map.directive'
import { GetBlockPipe } from './pipes/get-block.pipe'
import { GetLocationPipe } from './pipes/get-location.pipe'


@Component({
  selector: 'app-grid-layout',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    LetModule,
    GetLocationPipe,
    GetBlockPipe,
    CanvasDirective,
    GridDirective,
    DynamicComponentDirective,
    KeymapOverlayComponent,
    StringTotalsOverlayComponent,
    GridBackgroundComponent,
    WrapperDirective,
  ],
  templateUrl: './grid-layout.component.html',
  hostDirectives: [KeyMapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    /*    * {
          padding: 0;
          margin: 0;
          outline: 0;
          !*overflow: hidden;*!
        }

        *::-webkit-scrollbar:horizontal {
          height: 0;
          width: 0;
          display: none;
        }

        *::-webkit-scrollbar-thumb:horizontal {
          display: none;
        }

        .containerDIV::-webkit-scrollbar-thumb:horizontal {
          display: none;
        }

        .containerDIV::-webkit-scrollbar:horizontal {
          height: 0;
          width: 0;
          display: none;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          !*overflow: hidden;*!
        }

        .appWrapper {
          overflow: visible;
          !*overflow: visible;*!

        }

        .appWrapper::-webkit-scrollbar:horizontal {
          height: 0;
          width: 0;
          display: none;
        }

        .appWrapper::-webkit-scrollbar-thumb:horizontal {
          display: none;
        }

        .appGrid {
          !*overflow: visible;*!
        }

        div::-webkit-scrollbar {
          display: none;
        }

        .appGrid::-webkit-scrollbar {
          display: none;
        }*/

    /*

        .appGrid {
          -webkit-transform-origin: top center;
          -moz-transform-origin: top center;
          -webkit-backface-visibility: hidden;
          -webkit-transform: translateZ(0) scale(1.0, 1.0);
          transform-origin: top center;
        }*/
  `],
})
export class GridLayoutComponent implements OnInit, AfterViewInit {
  public clickService = inject(ClickService)
  public dropService = inject(DropService)
  public mouseService = inject(MouseService)
  public moveService = inject(MoveService)
  public doubleClickService = inject(DoubleClickService)
  private gridFacade = inject(GridFacade)
  private uiFacade = inject(UiFacade)
  private snackBar = inject(MatSnackBar)
  private selectedFacade = inject(SelectedFacade)
  private stringsFacade = inject(StringsFacade)
  private renderer = inject(Renderer2)
  @ViewChild('appGrid') appGrid!: ElementRef


  getScreenWidth!: number
  getScreenHeight!: number
  containerWidth!: number
  containerHeight!: number
  containerWidthString!: string
  containerHeightString!: string
  // getScreenWidth-200
  // private uiFacade = inject(UiFacade)
  showKeymap$ = this.uiFacade.isKeyMapEnabled$
  zoomLevel = 2
  isGridMoving = false
  scale = 1
  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number


  isZoomed = false
  blockHeight = 32
  blockWidth = 32

  blockHeightString = `${this.blockHeight}px`
  blockWidthString = `${this.blockWidth}px`
  backgroundHeight?: string
  backgroundWidth?: string

  constructor() {
    this.getScreenWidth = window.innerWidth
    this.getScreenHeight = window.innerHeight
    this.containerWidth = window.innerWidth - 200
    this.containerHeight = window.innerHeight - 200
    this.containerWidthString = `${window.innerWidth - 200}px`
    this.containerHeightString = `${window.innerHeight - 200}px`
    console.log(`${this.getScreenWidth}x${this.getScreenHeight}`)
    console.log(`${this.containerWidth}x${this.containerHeight}`)
    // console.log(`${this.getScreenWidth}x${this.getScreenHeight}`)
  }


  @Input() set gridSize(size: { rows: number, cols: number }) {
    this.backgroundHeight = `${size.rows * this.blockHeight + 1}px`
    this.backgroundWidth = `${size.cols * this.blockWidth + 1}px`
  }


  @Input() rows!: number
  @Input() cols!: number
  @Input() blocks$!: Observable<BlockModel[]>

  gridMode$ = this.gridFacade.gridMode$
  clientXY$ = this.gridFacade.clientXY$
  gridLayoutXY$ = this.uiFacade.gridLayoutXY$
  gridLayoutXY: GridLayoutXY = {
    componentX: undefined,
    componentY: undefined,
  }

  mouseXY: MouseXY = {
    mouseX: undefined,
    mouseY: undefined,
  }

  offsets: ElementOffsets = {
    offsetHeight: undefined,
    offsetWidth: undefined,
  }


  selectedString$: Observable<StringModel | undefined> = this.selectedFacade.selectedStringId$.pipe(
    switchMap(stringId => this.stringsFacade.stringById$(stringId).pipe(
      map(string => {
        if (!string) return undefined
        return string
      }),
    )),
  )


  ngAfterViewInit(): void {
    this.height = this.appGrid.nativeElement.style.height.split('p')[0]
    this.negativeHeight = Number(this.appGrid.nativeElement.style.height.split('p')[0]) * -1.
    this.width = this.appGrid.nativeElement.style.width.split('p')[0]
    this.negativeWidth = Number(this.appGrid.nativeElement.style.width.split('p')[0]) * -1.
    console.log(this.height, this.width)

  }

  moveTheDiv(event: MouseEvent) {
    /*
        if (!this.mouseXY.mouseX || !this.mouseXY.mouseY || !this.isGridMoving || !event.ctrlKey) return
        console.log(this.mouseXY)
        /!*   // if (event.ctrlKey && this.startX && this.startY && this.isDragging) {
           console.log(event.ctrlKey && this.startX && this.startY && this.isDragging)
           const mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
           const mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop

           const rect = this.appGrid.nativeElement.getBoundingClientRect()
           /!*        const newStartY = (this.startY - rect.top) / this.scale
                   const newStartX = (this.startX - rect.left) / this.scale*!/!*!/
        /!*    const newStartY = (this.mouseXY.mouseY) / this.scale
            const newStartX = (this.mouseXY.mouseX) / this.scale*!/
        const newStartY = (this.mouseXY.mouseY)
        const newStartX = (this.mouseXY.mouseX)
        const top = event.clientY - newStartY
        const left = event.clientX - newStartX
        console.log(top)
        if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
          return
        }
        if (left > this.width - (200 / this.scale) || left < this.negativeWidth + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
          return
        }

        this.appGrid.nativeElement.style.top = top + 'px'
        this.appGrid.nativeElement.style.left = left + 'px'

        event.preventDefault()
        event.stopPropagation()*/
  }

  ngOnInit(): void {
    console.log('gridLayout')
  }

  trackBlock(index: number, block: BlockModel) {
    return block.id
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  private snack(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration,
    })
  }

  async doubleCLick(doubleClick: MouseEventRequest) {
    await this.doubleClickService.doubleCLick(doubleClick)
  }

  async mouse(mouse: MouseEventRequest) {
    if (mouse.event.type === 'mouseup') {
      this.isGridMoving = false
    }
    console.log(mouse.event)


    if (mouse.event.button === 1 || mouse.event.ctrlKey) {
      if (mouse.event.type === 'mousedown') {
        this.isGridMoving = true
        // const posXY = await this.uiFacade.posXY
        // const rect = this.appGrid.nativeElement.getBoundingClientRect()
        /*        this.startX = event.clientX - rect.left
                this.startY = event.clientY - rect.top*/
        /*        const mouseX = mouse.event.clientX - rect.left
                const mouseY = mouse.event.clientY - rect.top*/
        const mouseX = mouse.event.clientX
        const mouseY = mouse.event.clientY
        this.mouseXY = {
          mouseX,
          mouseY,
        }
        // start = { x: e.clientX - pointX, y: e.clientY - pointY };
        /*        if (posXY && posXY.posX && posXY.posY) {

                  const mouseX = mouse.event.clientX - posXY.posX
                  const mouseY = mouse.event.clientY - posXY.posY
                  // start = { x: e.clientX - pointX, y: e.clientY - pointY }
                  this.mouseXY = {
                    mouseX,
                    mouseY,
                  }
                } else {
                  const mouseX = mouse.event.clientX
                  const mouseY = mouse.event.clientY
                  // start = { x: e.clientX - pointX, y: e.clientY - pointY }
                  this.mouseXY = {
                    mouseX,
                    mouseY,
                  }
                }*/
        /*        const mouseX = mouse.event.clientX
                const mouseY = mouse.event.clientY*/

        return
      }
      if (mouse.event.type === 'mouseup') {
        this.isGridMoving = false
      }
    }
    await this.mouseService.mouse(mouse)
  }

  async mouseDown(mouse: MouseEventRequest) {
    if (mouse.event.ctrlKey && mouse.event.type === 'mousedown') {
      console.log('MOUSEDOWN-COMPONENT', mouse.event)
      this.isGridMoving = true
      const mouseX = mouse.event.clientX
      const mouseY = mouse.event.clientY
      this.mouseXY = {
        mouseX,
        mouseY,
      }
      return
    }
    await this.mouseService.mouse(mouse)
  }

  async mouseUp(mouse: MouseEventRequest) {
    if (mouse.event.type === 'mouseup') {
      this.isGridMoving = false
      console.log('MOUSEUP-COMPONENT', mouse.event)
    }
    await this.mouseService.mouse(mouse)
  }

  async click(click: MouseEventRequest) {
    await this.clickService.click(click)
  }

  async drop(drop: CdkDragDrop<BlockModel[]>) {
    await this.dropService.drop(drop)
  }

  async move(move: MouseEventRequest) {
    move.event.preventDefault()


    if (this.isGridMoving && move.event.ctrlKey) {
      /*      if (move.event.type === 'mousemove' && this.mouseXY && this.mouseXY.mouseX && this.mouseXY.mouseY) {
              // console.log(move.event)
              // return this.moveTheDiv(move.event)
            }*/

      if (!this.mouseXY || !this.mouseXY.mouseX || !this.mouseXY.mouseY) return undefined
      const componentX = move.event.clientX - this.mouseXY.mouseX
      const componentY = move.event.clientY - this.mouseXY.mouseY
      this.gridLayoutXY = {
        componentX,
        componentY,
      }
      return
    }
    if (this.isGridMoving && !move.event.ctrlKey) {
      this.isGridMoving = false
    }
    return
  }

}
