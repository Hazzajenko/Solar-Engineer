import { Component, OnInit, ViewChild } from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { PanelsService } from '../../../services/panels.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { map } from 'rxjs/operators'
import { OldGridService } from '../../../services/old-grid.service'
import { combineLatest, Observable } from 'rxjs'
import { selectProjectByRouteParams } from '../../../store/projects/projects.selectors'
import { ProjectModel } from '../../../models/project.model'
import {
  selectCreateMode,
  selectGridMode,
  selectPanelToJoin,
  selectSelectedString,
  selectSelectedStrings,
  selectToJoinArray,
} from '../../../store/grid/grid.selectors'
import { BlockModel } from '../../../models/block.model'
import { selectBlocksByProjectIdRouteParams } from '../../../store/blocks/blocks.selectors'
import { CableModel } from '../../../models/cable.model'
import { UnitModel } from '../../../models/unit.model'
import { GridMode } from '../../../store/grid/grid-mode.model'
import { PanelsEntityService } from '../../services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../services/cables-entity/cables-entity.service'
import { StringsEntityService } from '../../services/strings-entity/strings-entity.service'
import { InvertersEntityService } from '../../services/inverters-entity/inverters-entity.service'
import { TrackersEntityService } from '../../services/trackers-entity/trackers-entity.service'
import { GridUpdateService } from '../../../services/grid/grid-update.service'
import { GridActionService } from '../../../services/grid/grid-action.service'
import { JoinsEntityService } from '../../services/joins-entity/joins-entity.service'
import { JoinModel } from '../../../models/join.model'
import { GridJoinService } from '../../../services/grid/grid-join.service'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { CommonModule } from '@angular/common'
import { LetModule } from '@ngrx/component'
import { GetGridStringPipe } from '../../../../pipes/get-grid-string.pipe'
import { FindBlockNumberPipe } from '../../../../pipes/find-block-number.pipe'
import { FindInverterLocationPipe } from '../../../../pipes/find-inverter-location.pipe'
import { MatTooltipModule } from '@angular/material/tooltip'
import { FindPanelLocationPipe } from '../../../../pipes/find-panel-location.pipe'
import { FindCableLocationPipe } from '../../../../pipes/find-cable-location.pipe'
import { GetCableSurroundingsPipe } from '../../../../pipes/get-cable-surroundings.pipe'
import { TopBottomSvgComponent } from '../../../../svgs/grid/top-bottom-svg.component'
import { LeftTopSvgComponent } from '../../../../svgs/grid/left-top-svg.component'
import { BottomSvgComponent } from '../../../../svgs/grid/bottom-svg.component'
import { LeftRightSvgComponent } from '../../../../svgs/grid/left-right-svg.component'
import { RightSvgComponent } from '../../../../svgs/grid/right-svg.component'
import { CableJoinComponent } from '../../../../components/cable-join/cable-join.component'
import { GetNearbyJoins } from '../../../../pipes/get-nearby-joins.pipe'
import { BlockPanelComponent } from './block-panel/block-panel.component'
import { BlockCableComponent } from './block-cable/block-cable.component'
import { BlockInverterComponent } from './block-inverter/block-inverter.component'
import { SelectedStateActions } from '../../../store/selected/selected.actions'
import {
  selectSelectedPanels,
  selectUnitSelected,
} from '../../../store/selected/selected.selectors'
import { GridLayoutDirective } from '../../../../directives/grid-layout.directive'
import { GridStateActions } from '../../../store/grid/grid.actions'
import { GridDeleteService } from '../../../services/grid/grid-delete.service'
import { DisconnectionPointModel } from '../../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../services/disconnection-points-entity/disconnection-points-entity.service'
import { BlockDisconnectionPointComponent } from '../block-disconnection-point/block-disconnection-point.component'
import { FindDisconnectionPointLocationPipe } from '../../../../pipes/find-disconnection-point-location.pipe'

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
  standalone: true,
  hostDirectives: [GridLayoutDirective],
  imports: [
    DragDropModule,
    LetModule,
    GetGridStringPipe,
    FindBlockNumberPipe,
    FindInverterLocationPipe,
    MatTooltipModule,
    FindPanelLocationPipe,
    FindCableLocationPipe,
    GetCableSurroundingsPipe,
    TopBottomSvgComponent,
    LeftTopSvgComponent,
    MatMenuModule,
    CommonModule,
    BottomSvgComponent,
    LeftRightSvgComponent,
    RightSvgComponent,
    CableJoinComponent,
    GetNearbyJoins,
    BlockPanelComponent,
    BlockCableComponent,
    BlockInverterComponent,
    BlockDisconnectionPointComponent,
    FindDisconnectionPointLocationPipe,
  ],
})
export class GridLayoutComponent implements OnInit {
  /*  @Input() inverters?: InverterModel[]
    @Input() trackers?: TrackerModel[]
    @Input() strings?: StringModel[]
    @Input() panels?: PanelModel[]
    @Input() selectedStringId?: number*/
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  takenBlocks: number[] = []
  grid$!: Observable<{
    createMode?: UnitModel
    selectedStrings?: StringModel[]
    selectedString?: StringModel
    gridMode?: GridMode
  }>
  selected$!: Observable<{
    unit?: UnitModel
    panels?: PanelModel[]
    panel?: PanelModel
  }>
  modes$!: Observable<{
    createMode: UnitModel
    gridMode: GridMode
  }>
  project$!: Observable<ProjectModel | undefined>
  inverters$!: Observable<InverterModel[]>
  trackers$!: Observable<TrackerModel[]>
  strings$!: Observable<StringModel[]>
  panels$!: Observable<PanelModel[]>
  cables$!: Observable<CableModel[]>
  blocks$!: Observable<BlockModel[]>
  joins$!: Observable<JoinModel[]>
  disconnectionPoints$!: Observable<DisconnectionPointModel[]>
  toJoinArray$!: Observable<string[]>
  panelToJoin$!: Observable<PanelModel[]>
  rows = 20
  cols = 40

  constructor(
    private panelsService: PanelsService,
    private store: Store<AppState>,
    public grid: OldGridService,
    // public gridCell: GridService,
    public gridAction: GridActionService,
    public gridDrag: GridUpdateService,
    private panelsEntity: PanelsEntityService,
    private cablesEntity: CablesEntityService,
    private stringsEntity: StringsEntityService,
    private invertersEntity: InvertersEntityService,
    private trackersEntity: TrackersEntityService,
    private joinsEntity: JoinsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    public gridJoins: GridJoinService,
    public gridDelete: GridDeleteService,
  ) {
    /*    this.panels?.forEach((panel) => {
          // console.log(panel?.location)
        })*/
  }

  ngOnInit(): void {
    // this.selectedString$ = this.store.select(selectSelectedString)
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.inverters$ = this.invertersEntity.entities$
    // this.inverters$ = this.store.select(selectInvertersByProjectIdRouteParams)
    this.trackers$ = this.trackersEntity.entities$
    // this.trackers$ = this.store.select(selectTrackersByProjectIdRouteParams)
    this.strings$ = this.stringsEntity.entities$
    // this.strings$ = this.store.select(selectStringsByProjectIdRouteParams)
    this.panels$ = this.panelsEntity.entities$
    // this.panels$ = this.store.select(selectPanelsByProjectIdRouteParams)
    this.cables$ = this.cablesEntity.entities$
    this.joins$ = this.joinsEntity.entities$
    this.disconnectionPoints$ = this.disconnectionPointsEntity.entities$
    // this.cables$ = this.store.select(selectCablesByProjectIdRouteParams)
    this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)
    this.toJoinArray$ = this.store.select(selectToJoinArray)
    this.panelToJoin$ = this.store.select(selectPanelToJoin)

    this.grid$ = combineLatest([
      this.store.select(selectCreateMode),
      this.store.select(selectSelectedStrings),
      this.store.select(selectSelectedString),
      this.store.select(selectGridMode),
    ]).pipe(
      map(([createMode, selectedStrings, selectedString, gridMode]) => ({
        createMode,
        selectedStrings,
        selectedString,
        gridMode,
      })),
    )
    this.modes$ = combineLatest([
      this.store.select(selectCreateMode),
      this.store.select(selectGridMode),
    ]).pipe(
      map(([createMode, gridMode]) => ({
        createMode,
        gridMode,
      })),
    )
    this.selected$ = combineLatest([
      this.store.select(selectUnitSelected),
      this.store.select(selectSelectedPanels),
    ]).pipe(
      map(([unit, panels]) => ({
        unit,
        panels,
      })),
    )
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  onRightClick(event: MouseEvent, item: any) {
    event.preventDefault()
    console.log(item)

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    // console.log(this.menuTopLeftPosition.x)
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { item }
    this.matMenuTrigger.openMenu()
  }

  click() {}

  deleteBlock(block: any) {
    if (!block) return
    switch (block.model) {
      case UnitModel.INVERTER:
        return this.invertersEntity.delete(block.id)
      case UnitModel.PANEL:
        return this.panelsEntity.delete(block.id)
      case UnitModel.CABLE:
        return this.cablesEntity.delete(block.id)
      default:
        break
    }
    return
  }

  deletePanel(panel: PanelModel) {
    this.panelsEntity.delete(panel.id)
    // await this.panelsService.deletePanel(3, panel.id)
  }

  deleteCable(cable: CableModel) {
    this.cablesEntity.delete(cable.id)
  }

  joinCables(toJoinArray: string[]) {}

  startJoin(block: any) {
    if (!block) return
    switch (block.model) {
      case UnitModel.INVERTER:
        return
      case UnitModel.PANEL:
        return
      case UnitModel.CABLE:
        return this.cablesEntity.delete(block.id)
      default:
        break
    }
    return
  }

  selectBlock(block: any, gridMode: GridMode) {
    if (!block || !gridMode) return
    if (gridMode === GridMode.JOIN || gridMode == GridMode.DELETE) {
      return
    } else {
      if (gridMode !== GridMode.SELECT) {
        this.store.dispatch(
          GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
        )
      }

      switch (block.model) {
        case UnitModel.INVERTER:
          return
        case UnitModel.PANEL:
          return this.store.dispatch(
            SelectedStateActions.selectPanel({ panel: block }),
          )
        case UnitModel.CABLE:
          return
        case UnitModel.DISCONNECTIONPOINT:
          console.log(block)
          return this.store.dispatch(
            SelectedStateActions.selectDisconnectionPoint({
              disconnectionPointId: block?.id,
            }),
          )
        default:
          break
      }
      return
    }
    /*    this.store.select(selectGridMode).subscribe((gridMode) => {
          if (gridMode === GridMode.JOIN || gridMode == GridMode.DELETE) {
            return
          } else {
            if (gridMode !== GridMode.SELECT) {
              this.store.dispatch(
                GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
              )
            }

            switch (block.model) {
              case UnitModel.INVERTER:
                return
              case UnitModel.PANEL:
                return this.store.dispatch(
                  SelectedStateActions.selectPanel({ panel: block }),
                )
              case UnitModel.CABLE:
                return
              default:
                break
            }
            return
          }
        })*/
  }

  selectString(stringId: string) {
    this.store.dispatch(
      GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
    )
    this.store.dispatch(SelectedStateActions.selectString({ stringId }))
  }
}
