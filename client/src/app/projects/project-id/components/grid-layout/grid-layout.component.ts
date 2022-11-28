import { JoinsState } from './../../../store/joins/joins.reducer';
import { SelectedState } from './../../../store/selected/selected.reducer'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { map } from 'rxjs/operators'
import { combineLatest, Observable } from 'rxjs'
import { selectProjectByRouteParams } from '../../../store/projects/projects.selectors'
import { ProjectModel } from '../../../models/project.model'
import {
  selectCreateMode,
  selectGridMode,
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
import { MatMenuModule } from '@angular/material/menu'
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
import { GridLayoutDirective } from '../../../../directives/grid-layout.directive'
import { GridDeleteService } from '../../../services/grid/grid-delete.service'
import { DisconnectionPointModel } from '../../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../services/disconnection-points-entity/disconnection-points-entity.service'
import { BlockDisconnectionPointComponent } from '../block-disconnection-point/block-disconnection-point.component'
import { FindDisconnectionPointLocationPipe } from '../../../../pipes/find-disconnection-point-location.pipe'
import { GetPanelPipe } from '../../../../pipes/get-panel.pipe'
import { GetCablePipe } from '../../../../pipes/get-cable.pipe'
import { BlockSwitchComponent } from './block-switch/block-switch.component'
import { BlockByLocationPipe } from './block-by-location.pipe'
import { selectSelectedUnitAndIds } from '../../../store/selected/selected.selectors'
import { SelectedModel } from '../../../models/selected.model'
import { PanelJoinsEntityService } from '../../services/panel-joins-entity/panel-joins-entity.service'
import { PanelJoinModel } from '../../../models/panel-join.model'
import { BlockDirective } from './block.directive'
import { selectJoinsState } from 'src/app/projects/store/joins/joins.selectors';

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
  standalone: true,
  hostDirectives: [GridLayoutDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    GetPanelPipe,
    GetCablePipe,
    BlockSwitchComponent,
    BlockByLocationPipe,
    BlockDirective,
  ],
})
export class GridLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  // selectedBlock: string = ''
  // @ViewChildren(BlockSwitchComponent)
  // blockSwitchComponents!: QueryList<BlockSwitchComponent>
  modes$!: Observable<{
    createMode: UnitModel
    gridMode: GridMode
  }>

  units$!: Observable<{
    inverters?: InverterModel[]
    strings?: StringModel[]
    panels?: PanelModel[]
    cables?: CableModel[]
    joins?: JoinModel[]
    panelJoins?: PanelJoinModel[]
    disconnectionPoints?: DisconnectionPointModel[]
  }>
  project$!: Observable<ProjectModel | undefined>
  inverters$!: Observable<InverterModel[]>
  // trackers$!: Observable<TrackerModel[]>

  strings$!: Observable<StringModel[]>
  panels$!: Observable<PanelModel[]>
  cables$!: Observable<CableModel[]>
  blocks$!: Observable<BlockModel[]>
  // joins$!: Observable<JoinModel[]>
  joins$!: Observable<JoinsState>
  panelJoins$!: Observable<PanelJoinModel[]>
  disconnectionPoints$!: Observable<DisconnectionPointModel[]>
  selected$!: Observable<SelectedState>
  rows = 20
  cols = 40
  /*  selected$!: Observable<{
      unit?: UnitModel
      panels?: PanelModel[]
      panel?: PanelModel
    }>*/
  @ViewChild(BlockDirective)
  blockDirectives!: QueryList<BlockDirective>

  constructor(
    private store: Store<AppState>,
    public gridAction: GridActionService,
    public gridDrag: GridUpdateService,
    private panelsEntity: PanelsEntityService,
    private cablesEntity: CablesEntityService,
    private stringsEntity: StringsEntityService,
    private invertersEntity: InvertersEntityService,
    private trackersEntity: TrackersEntityService,
    private joinsEntity: JoinsEntityService,
    private panelJoinsEntity: PanelJoinsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    public gridDelete: GridDeleteService,
  ) {}

  /*  set block(v: BlockDirective) {
      setTimeout(() => {
        this.selectedBlock = v.id
        console.log('BLOCKDIRECTIVE', v.id)
      }, 0)
    }*/

  ngOnDestroy(): void {
    throw new Error('Method not implemented.')
  }

  ngOnInit(): void {
    this.project$ = this.store.select(selectProjectByRouteParams)
    // this.inverters$ = this.invertersEntity.entities$
    // this.strings$ = this.stringsEntity.entities$
    // this.panels$ = this.panelsEntity.entities$
    // this.cables$ = this.cablesEntity.entities$
    // this.joins$ = this.joinsEntity.entities$
    // this.disconnectionPoints$ = this.disconnectionPointsEntity.entities$
    this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)
    this.selected$ = this.store.select(selectSelectedUnitAndIds)
    // this.panelJoins$ = this.panelJoinsEntity.entities$
    this.joins$ = this.store.select(selectJoinsState)
    this.units$ = combineLatest([
      this.invertersEntity.entities$,
      this.stringsEntity.entities$,
      this.panelsEntity.entities$,
      this.cablesEntity.entities$,
      this.joinsEntity.entities$,
      this.panelJoinsEntity.entities$,
      this.disconnectionPointsEntity.entities$,
    ]).pipe(
      map(
        ([
          inverters,
          strings,
          panels,
          cables,
          joins,
          panelJoins,
          disconnectionPoints,
        ]) => ({
          inverters,
          strings,
          panels,
          cables,
          joins,
          panelJoins,
          disconnectionPoints,
        }),
      ),
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
  }

  ngAfterViewInit() {
    // console.log(this.blockDirectives.toArray())
    /*    console.log(
          this.blockSwitchComponents.find(
            (comp) => comp.block?.location === 'row9col13',
          ),
        )
        const findIt = this.blockSwitchComponents
          .toArray()
          .find((comp) => comp.block?.location === 'row9col13')
        console.log(findIt)

        const mapIt = this.blockSwitchComponents.toArray().map((comp) => {
          return comp.block
        })
        console.log(mapIt)
        console.log(this.blockSwitchComponents.toArray())*/
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  getSelectedModelFromState(
    unit?: UnitModel,
    multiSelect?: boolean,
    singleSelectId?: string,
    multiSelectIds?: string[],
  ): SelectedModel {
    return {
      unit,
      multiSelect,
      singleSelectId,
      multiSelectIds,
    } as SelectedModel
  }
}
function shareReplay(): import('rxjs').OperatorFunction<
  InverterModel[],
  unknown
> {
  throw new Error('Function not implemented.')
}
