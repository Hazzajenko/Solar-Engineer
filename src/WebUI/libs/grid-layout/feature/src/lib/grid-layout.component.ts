import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  ClickService,
  DoubleClickService,
  DropService,
  MouseEventRequest,
  MouseService,
  ClientXY,
  ElementOffsets,
  GridLayoutXY,
  MouseXY,
  XYModel,
} from '@grid-layout/data-access'

import { KeymapOverlayComponent } from './ui/keymap/keymap.component'
import { StringTotalsOverlayComponent } from './ui/string-stats/string-stats.component'

import { LetModule } from '@ngrx/component'
import {
  GridFacade,
  PathsStoreService,
  SelectedFacade,
  SelectedStoreService,
  StringsFacade,
  StringsStoreService,
  UiFacade,
  UiStoreService,
} from '@project-id/data-access/facades'
import { BlockModel, SelectedPanelLinkPathModel, StringModel } from '@shared/data-access/models'
import { combineLatest, map, Observable, switchMap } from 'rxjs'
import { combineLatestWith } from 'rxjs/operators'

import { CanvasDirective } from './directives/canvas.directive'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'
import { GridDirective } from './directives/grid.directive'
import { KeyMapDirective } from './directives/key-map.directive'

import { WrapperDirective } from './directives/wrapper.directive'
import { GetBlockPipe } from './pipes/get-block.pipe'
import { GetLocationPipe } from './pipes/get-location.pipe'
import { GridBackgroundComponent } from './ui/grid-background/grid-background.component'

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
export class GridLayoutComponent implements OnInit {
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
  private pathsStore = inject(PathsStoreService)
  private stringsStore = inject(StringsStoreService)
  private selectedStore = inject(SelectedStoreService)
  getScreenWidth!: number
  getScreenHeight!: number

  gridContainerWidth!: string

  gridContainerHeight!: string
  layoutWidth!: number
  layoutHeight!: number
  layoutWidthString!: string
  layoutHeightString!: string
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

  pageXY: XYModel = {
    x: 0,
    y: 0,
  }
  isKeyMapEnabled$ = this.uiStore.select.isKeyMapEnabled$
  isStringStatsEnabled$ = this.uiStore.select.isStringStatsEnabled$

  uiState$: Observable<{
    keyMap: boolean
    stringStats: boolean
  }> = combineLatest([this.isKeyMapEnabled$, this.isStringStatsEnabled$]).pipe(
    map(([keyMap, stringStats]) => {
      return {
        keyMap,
        stringStats,
      }
    }),
  )

  constructor() {
    // console.log(`${this.getScreenWidth}x${this.getScreenHeight}`)
  }

  @Input() set gridSize(size: { rows: number; cols: number }) {
    // this.backgroundHeight = `${size.rows * this.blockHeight + 1}px`
    // this.backgroundWidth = `${size.cols * this.blockWidth + 1}px`
  }

  // rows = 28
  // cols = 37 + 14
  rows!: number
  cols!: number
  //
  // @Input() rows!: number
  // @Input() cols!: number
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

  screenHasBeenSet = false

  selectedString$: Observable<StringModel | undefined> = this.selectedFacade.selectedStringId$.pipe(
    switchMap((stringId) =>
      this.stringsFacade.stringById$(stringId).pipe(
        map((string) => {
          if (!string) return undefined
          return string
        }),
      ),
    ),
  )

  panelLinkPath$: Observable<SelectedPanelLinkPathModel | undefined> =
    this.pathsStore.select.selectedPanelLinkPath$.pipe(
      combineLatestWith(this.selectedStore.select.selectedId$),
      map(([paths, isSelectedString]) => {
        if (!isSelectedString) return undefined
        return paths
      }),
    )

  ngOnInit() {
    this.getScreenWidth = window.innerWidth
    // this.getScreenHeight = window.innerHeight - 160
    this.getScreenHeight = window.innerHeight
    this.gridContainerWidth = `${window.innerWidth}px`
    // this.gridContainerHeight = `${window.innerHeight - 160}px`
    this.gridContainerHeight = `${window.innerHeight}px`
    /*    this.layoutWidth = window.innerWidth - 100
        this.layoutHeight = window.innerHeight - 100
        this.layoutWidthString = `${window.innerWidth - 100}px`
        this.layoutHeightString = `${window.innerHeight - 100}px`
        this.containerWidth = window.innerWidth - 200
        this.containerHeight = window.innerHeight - 200
        this.containerWidthString = `${window.innerWidth - 200}px`
        this.containerHeightString = `${window.innerHeight - 200}px`
        console.log(`${this.getScreenWidth}x${this.getScreenHeight}`)
        console.log(`${this.containerWidth}x${this.containerHeight}`)*/
    this.initScreenSize()
  }

  initScreenSize() {
    this.rows = Math.floor((this.getScreenHeight - 100) / this.blockHeight)
    this.cols = Math.floor((this.getScreenWidth - 100) / this.blockWidth)
    console.log(this.rows, this.cols)
    this.layoutHeight = this.rows * this.blockHeight
    this.layoutWidth = this.cols * this.blockWidth
    this.layoutWidthString = `${this.layoutWidth}px`
    this.layoutHeightString = `${this.layoutHeight}px`

    // this.rows = 28
    // this.cols = 37 + 14
    this.backgroundHeight = `${this.layoutHeight + 1}px`
    this.backgroundWidth = `${this.layoutWidth + 1}px`
    this.screenHasBeenSet = true
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

  async click(click: MouseEventRequest) {
    await this.clickService.click(click)
  }

  async drop(drop: CdkDragDrop<BlockModel[]>) {
    await this.dropService.drop(drop)
  }
}
