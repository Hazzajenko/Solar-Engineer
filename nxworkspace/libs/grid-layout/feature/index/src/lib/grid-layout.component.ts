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
    * {
      padding: 0;
      margin: 0;
      outline: 0;
      /*overflow: hidden;*/
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      /*overflow: hidden;*/
    }

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
  @ViewChild('appGrid') appGrid!: ElementRef;


  public getScreenWidth: any

  public getScreenHeight: any
  // private uiFacade = inject(UiFacade)
  showKeymap$ = this.uiFacade.isKeyMapEnabled$
  zoomLevel = 2
  isGridMoving = false
  scale = 1

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
    console.log(`${this.getScreenWidth}x${this.getScreenHeight}`)
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
    console.log(this.appGrid.nativeElement)

  }

  moveTheDiv() {


    // if (event.ctrlKey && this.startX && this.startY && this.isDragging) {
    console.log(event.ctrlKey && this.startX && this.startY && this.isDragging)
    const mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
    const mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop

    const rect = this.elementRef.nativeElement.getBoundingClientRect()
    /*        const newStartY = (this.startY - rect.top) / this.scale
            const newStartX = (this.startX - rect.left) / this.scale*/
    const newStartY = (this.startY) / this.scale
    const newStartX = (this.startX) / this.scale
    const top = mouseY - newStartY
    const left = mouseX - newStartX
    console.log(top)
    if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
      return
    }
    if (left > this.width - (200 / this.scale) || left < this.negativeWidth + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
      return
    }

    this.elementRef.nativeElement.style.top = top + 'px'
    this.elementRef.nativeElement.style.left = left + 'px'

    // this.elementRef.nativeElement.style.top = top + 'px'
    // this.elementRef.nativeElement.style.left = left + 'px'
    /*        if (this.scale > 1) {
              if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale)) {
                this.elementRef.nativeElement.style.top = '0px'
                this.elementRef.nativeElement.style.left = '0px'
              } else {
                this.elementRef.nativeElement.style.top = top + 'px'
                this.elementRef.nativeElement.style.left = left + 'px'
              }
            }
            if (top > this.height - (200) || top < this.negativeHeight + (200)) {
              this.elementRef.nativeElement.style.top = '0px'
              this.elementRef.nativeElement.style.left = '0px'
            } else {
              this.elementRef.nativeElement.style.top = top + 'px'
              this.elementRef.nativeElement.style.left = left + 'px'
            }*/
    /*
            if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale)) {
              console.log(this.height - (200 * this.scale))
              console.log(this.negativeHeight + (200 * this.scale))
              return
            }
    */


    event.preventDefault()
    event.stopPropagation()

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
        const posXY = await this.uiFacade.posXY
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

  async click(click: MouseEventRequest) {
    await this.clickService.click(click)
  }

  async drop(drop: CdkDragDrop<BlockModel[]>) {
    await this.dropService.drop(drop)
  }

  async move(move: MouseEventRequest) {
    move.event.preventDefault()
    if (this.isGridMoving && move.event.ctrlKey) {

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
