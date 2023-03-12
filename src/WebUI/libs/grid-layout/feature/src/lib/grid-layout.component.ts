import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  ClickService,
  ClientXY,
  DoubleClickService,
  DropService,
  ElementOffsets,
  GridFacade,
  MouseEventRequest,
  PathsStoreService,
  SelectedFacade,
  SelectedStoreService,
  StringsFacade,
  UiStoreService,
  XYModel,
} from '@grid-layout/data-access'

import { KeymapOverlayComponent } from './ui/keymap/keymap.component'
import { StringTotalsOverlayComponent } from './ui/string-stats/string-stats.component'

import { LetModule } from '@ngrx/component'
import { BlockModel, SelectedPanelLinkPathModel, StringModel } from '@shared/data-access/models'
import { combineLatest, map, Observable, of, switchMap } from 'rxjs'
import { combineLatestWith } from 'rxjs/operators'

import { CanvasDirective } from './directives/canvas.directive'
import { DynamicComponentDirective } from './directives/dynamic-component.directive'
import { GridDirective } from './directives/grid.directive'
import { KeyMapDirective } from './directives/key-map.directive'

import { WrapperDirective } from './directives/wrapper.directive'
import { GetBlockPipe } from './pipes/get-block.pipe'
import { GetLocationPipe } from './pipes/get-location.pipe'
import { GridBackgroundComponent } from './ui/grid-background/grid-background.component'
import { ContainerSizes } from './container-sizes'

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
})
export class GridLayoutComponent implements OnInit {
  public clickService = inject(ClickService)
  public dropService = inject(DropService)
  public doubleClickService = inject(DoubleClickService)
  private uiStore = inject(UiStoreService)
  private snackBar = inject(MatSnackBar)
  private selectedFacade = inject(SelectedFacade)
  private stringsFacade = inject(StringsFacade)
  private gridFacade = inject(GridFacade)
  // private gridLayoutService = inject(GridLayoutService)

  @Input() blocks$!: Observable<BlockModel[]>
  // containerSizes: ContainerSizes = this.initContainerSize()
  // containerSizes: ContainerSizes = this.gridLayoutService.initContainerSize()
  // containerSizes: ContainerSizes | undefined
  getScreenWidth!: number
  getScreenHeight!: number
  gridContainerWidth!: string
  gridContainerHeight!: string
  layoutWidth!: number
  layoutHeight!: number
  layoutWidthString!: string
  layoutHeightString!: string
  scale = 1
  height!: number
  keyUp = ''
  width!: number
  clientXY: ClientXY = {
    clientX: undefined,
    clientY: undefined,
  }
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
  uiState$: Observable<{
    keyMap: boolean
    stringStats: boolean
  }> = combineLatest([
    this.uiStore.select.isKeyMapEnabled$,
    this.uiStore.select.isStringStatsEnabled$,
  ]).pipe(
    map(([keyMap, stringStats]) => {
      return {
        keyMap,
        stringStats,
      }
    }),
  )
  rows!: number
  cols!: number

  offsets: ElementOffsets = {
    offsetHeight: undefined,
    offsetWidth: undefined,
  }
  screenHasBeenSet = false
  gridMode$ = this.gridFacade.gridMode$

  selectedString$: Observable<StringModel | undefined> = this.selectedFacade.selectedStringId$.pipe(
    switchMap((stringId) =>
      stringId
        ? this.stringsFacade.stringById$(stringId).pipe(
            map((string) => {
              if (!string) return undefined
              return string
            }),
          )
        : of(undefined),
    ),
  )

  keyPressed$ = this.uiStore.select.keyPressed$
  scale$ = this.uiStore.select.scale$
  private pathsStore = inject(PathsStoreService)
  private selectedStore = inject(SelectedStoreService)
  panelLinkPath$: Observable<SelectedPanelLinkPathModel | undefined> =
    this.pathsStore.select.selectedPanelLinkPath$.pipe(
      combineLatestWith(this.selectedStore.select.selectedId$),
      map(([paths, isSelectedString]) => {
        if (!isSelectedString) return undefined
        return paths
      }),
    )

  ngOnInit() {
    // this.gridLayoutService.initContainerSize()
    /*    this.containerSizes = this.gridLayoutService.initContainerSize(
          window.innerHeight,
          window.innerWidth,
        )*/
    // this.containerSizes = this.initContainerSize()
    this.getScreenWidth = window.innerWidth
    this.getScreenHeight = window.innerHeight
    this.gridContainerWidth = `${window.innerWidth}px`
    this.gridContainerHeight = `${window.innerHeight}px`
    this.initScreenSize()
  }

  initScreenSize() {
    this.rows = Math.floor((this.getScreenHeight - 100) / this.blockHeight)
    this.cols = Math.floor((this.getScreenWidth - 100) / this.blockWidth)
    this.layoutHeight = this.rows * this.blockHeight
    this.layoutWidth = this.cols * this.blockWidth
    this.layoutWidthString = `${this.layoutWidth}px`
    this.layoutHeightString = `${this.layoutHeight}px`
    this.backgroundHeight = `${this.layoutHeight + 1}px`
    this.backgroundWidth = `${this.layoutWidth + 1}px`
    this.screenHasBeenSet = true
  }

  numSequence(n: number): Array<number> {
    return Array(n)
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

  private snack(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration,
    })
  }

  private initContainerSize() {
    const gridContainerWidth = window.innerWidth
    const gridContainerHeight = window.innerHeight
    const gridContainerWidthString = `${window.innerWidth}px`
    const gridContainerHeightString = `${window.innerHeight}px`
    const rows = Math.floor((gridContainerHeight - 100) / this.blockHeight)
    const cols = Math.floor((gridContainerWidth - 100) / this.blockWidth)
    const layoutHeight = rows * this.blockHeight
    const layoutWidth = cols * this.blockWidth
    const layoutWidthString = `${layoutWidth}px`
    const layoutHeightString = `${layoutHeight}px`
    const backgroundHeightString = `${layoutHeight + 1}px`
    const backgroundWidthString = `${layoutWidth + 1}px`
    const containerSizes: ContainerSizes = {
      gridContainerWidthString,
      gridContainerHeightString,
      layoutWidthString,
      layoutHeightString,
      backgroundHeightString,
      backgroundWidthString,
    }
    return containerSizes
  }
}
