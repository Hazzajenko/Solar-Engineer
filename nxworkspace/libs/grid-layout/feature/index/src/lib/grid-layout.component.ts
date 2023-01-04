import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ClickService, DropService, MouseService } from '@grid-layout/data-access/services'
import { MouseEventRequest } from '@grid-layout/data-access/utils'
import { KeymapOverlayComponent } from '@grid-layout/feature/keymap'
import { StringTotalsOverlayComponent } from '@grid-layout/feature/string-stats'
import { ControllerEvent, ElementOffsets, GridLayoutXY, MouseXY } from '@grid-layout/shared/models'
import { LetModule } from '@ngrx/component'
import { GridFacade, SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { BlockModel, StringModel } from '@shared/data-access/models'
import { DoubleClickService } from 'libs/grid-layout/data-access/services/src/lib/double-click.service'
import { MoveService } from 'libs/grid-layout/data-access/services/src/lib/move.service'
import { UiFacade } from 'libs/project-id/data-access/facades/src/lib/ui.facade'
import { Observable, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'
import { CanvasDirective } from './directives/canvas.directive'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'
import { GridDirective } from './directives/grid.directive'
import { KeyMapDirective } from './directives/key-map.directive'
import { GetBlockPipe } from './pipes/get-block.pipe'
import { GetLocationPipe } from './pipes/get-location.pipe'


const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

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
  ],
  templateUrl: './grid-layout.component.html',
  hostDirectives: [KeyMapDirective],
  styles: [`
    * {
      padding: 0;
      margin: 0;
      outline: 0;
      overflow: hidden;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /*

    #zoom {
      width: 100%;
      height: 100%;
      transform-origin: 0px 0px;
      transform: scale(1) translate(0px, 0px);
      !*cursor: grab;*!
    }

    div#zoom > #appGrid {
      width: 100%;
      height: auto;
    }
    */


    .appGrid {
      width: 100%;
      height: 100%;
      transition: transform .1s;
      transform-origin: 0 0;
    }

    #appGrid {
      width: auto;
      height: auto;
      max-width: 100%;
    }
  `],
})
export class GridLayoutComponent {
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
  public getScreenWidth: any
  public getScreenHeight: any
  // private uiFacade = inject(UiFacade)
  showKeymap$ = this.uiFacade.isKeyMapEnabled$
  zoomLevel = 2
  isGridMoving = false

  constructor() {
    this.getScreenWidth = window.innerWidth
    this.getScreenHeight = window.innerHeight
    console.log(`${this.getScreenWidth}x${this.getScreenHeight}`)
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

  listDragOver(e: any, blocks: BlockModel[]) {
    if (e.dragItem && Array.isArray(e.dragItem)) {
      const targetIndex = blocks.indexOf(e.targetItem)
      if (targetIndex <= 2)
        e.cancel = true
    }
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
        // start = { x: e.clientX - pointX, y: e.clientY - pointY };
        if (posXY && posXY.posX && posXY.posY) {

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
        }
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
      console.log(move.event)
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
