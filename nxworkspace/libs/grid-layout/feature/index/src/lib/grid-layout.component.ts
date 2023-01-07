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
import {
  ClickService,
  DoubleClickService,
  DropService,
  MouseEventRequest,
  MouseService,
} from '@grid-layout/data-access/services'

import { KeymapOverlayComponent } from '@grid-layout/feature/keymap'
import { StringTotalsOverlayComponent } from '@grid-layout/feature/string-stats'
import { ClientXY, ElementOffsets, GridLayoutXY, MouseXY } from '@grid-layout/shared/models'
import { LetModule } from '@ngrx/component'
import { GridFacade, SelectedFacade, StringsFacade, UiStoreService } from '@project-id/data-access/facades'
import { BlockModel, StringModel } from '@shared/data-access/models'

import { WrapperDirective } from './directives/wrapper.directive'
import { GridBackgroundComponent } from './ui/grid-background.component'
import { UiFacade } from '@project-id/data-access/facades'
import { Observable, switchMap } from 'rxjs'
import { map } from 'rxjs'

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
    KeyMapDirective,
  ],
  templateUrl: './grid-layout.component.html',
  /*  hostDirectives: [KeyMapDirective],*/
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
})
export class GridLayoutComponent {
  public clickService = inject(ClickService)
  public dropService = inject(DropService)
  public mouseService = inject(MouseService)
  public doubleClickService = inject(DoubleClickService)
  private gridFacade = inject(GridFacade)
  private uiFacade = inject(UiFacade)
  private snackBar = inject(MatSnackBar)
  private selectedFacade = inject(SelectedFacade)
  private stringsFacade = inject(StringsFacade)
  private uiStore = inject(UiStoreService)
  getScreenWidth!: number
  getScreenHeight!: number
  containerWidth!: number
  containerHeight!: number
  containerWidthString!: string
  containerHeightString!: string
  // getScreenWidth-200
  // private uiFacade = inject(UiFacade)
  showKeymap$ = this.uiFacade.isKeyMapEnabled$
  keyPressed$ = this.uiStore.select.keyPressed$
  scale$ = this.uiStore.select.scale$
  zoomLevel = 2
  isGridMoving = false
  scale = 1
  height!: number
  negativeHeight!: number
  keyUp = ''

  width!: number
  negativeWidth!: number
  clientXY: ClientXY = {
    clientX: undefined,
    clientY: undefined,
  }

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

  async click(click: MouseEventRequest) {
    await this.clickService.click(click)
  }

  async drop(drop: CdkDragDrop<BlockModel[]>) {
    await this.dropService.drop(drop)
  }


}
