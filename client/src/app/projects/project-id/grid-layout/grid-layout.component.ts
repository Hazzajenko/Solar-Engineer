import { LinksState } from '../services/store/links/links.reducer'
import { SelectedState } from '../services/store/selected/selected.reducer'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { InverterModel } from '../../models/inverter.model'
import { StringModel } from '../../models/string.model'
import { PanelModel } from '../../models/panel.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { map } from 'rxjs/operators'
import { combineLatest, combineLatestWith, firstValueFrom, Observable } from 'rxjs'
import { selectProjectByRouteParams } from '../services/store/projects/projects.selectors'
import { ProjectModel } from '../../models/project.model'
import { selectCreateMode, selectGridMode } from '../services/store/grid/grid.selectors'
import { BlockModel } from '../../models/block.model'
import { selectBlocksByProjectIdRouteParams } from '../services/store/blocks/blocks.selectors'
import { CableModel } from '../../models/cable.model'
import { UnitModel } from '../../models/unit.model'
import { GridMode } from '../services/store/grid/grid-mode.model'
import { PanelsEntityService } from '../services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../services/ngrx-data/cables-entity/cables-entity.service'
import { StringsEntityService } from '../services/ngrx-data/strings-entity/strings-entity.service'
import { InvertersEntityService } from '../services/ngrx-data/inverters-entity/inverters-entity.service'
import { TrackersEntityService } from '../services/ngrx-data/trackers-entity/trackers-entity.service'
import { GridUpdateService } from '../../services/grid/grid-update.service'
import { GridActionService } from '../../services/grid/grid-action.service'
import { JoinsEntityService } from '../services/ngrx-data/joins-entity/joins-entity.service'
import { JoinModel } from '../../models/join.model'
import { MatMenuModule } from '@angular/material/menu'
import { CommonModule } from '@angular/common'
import { LetModule } from '@ngrx/component'
import { GetGridStringPipe } from '../../../pipes/get-grid-string.pipe'
import { FindBlockNumberPipe } from '../../../pipes/find-block-number.pipe'
import { FindInverterLocationPipe } from '../../../pipes/find-inverter-location.pipe'
import { MatTooltipModule } from '@angular/material/tooltip'
import { FindPanelLocationPipe } from '../../../pipes/find-panel-location.pipe'
import { FindCableLocationPipe } from '../../../pipes/find-cable-location.pipe'
import { GetCableSurroundingsPipe } from '../../../pipes/get-cable-surroundings.pipe'
import { TopBottomSvgComponent } from '../../../svgs/grid/top-bottom-svg.component'
import { LeftTopSvgComponent } from '../../../svgs/grid/left-top-svg.component'
import { BottomSvgComponent } from '../../../svgs/grid/bottom-svg.component'
import { LeftRightSvgComponent } from '../../../svgs/grid/left-right-svg.component'
import { RightSvgComponent } from '../../../svgs/grid/right-svg.component'
import { CableJoinComponent } from '../../../components/cable-join/cable-join.component'
import { GetNearbyJoins } from '../../../pipes/get-nearby-joins.pipe'
import { BlockPanelComponent } from './block-switch/block-panel/block-panel.component'
import { BlockCableComponent } from './block-switch/block-cable/block-cable.component'
import { BlockInverterComponent } from './block-switch/block-inverter/block-inverter.component'
import { GridLayoutDirective } from '../../../directives/grid-layout.directive'
import { DisconnectionPointModel } from '../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { BlockDisconnectionPointComponent } from './block-switch/block-disconnection-point/block-disconnection-point.component'
import { FindDisconnectionPointLocationPipe } from '../../../pipes/find-disconnection-point-location.pipe'
import { GetPanelPipe } from '../../../pipes/get-panel.pipe'
import { GetCablePipe } from '../../../pipes/get-cable.pipe'
import { BlockSwitchComponent } from './block-switch/block-switch.component'
import { BlockByLocationPipe } from './block-by-location.pipe'
import { selectSelectedUnitAndIds } from '../services/store/selected/selected.selectors'
import { LinksEntityService } from '../services/ngrx-data/links-entity/links-entity.service'
import { LinkModel } from '../../models/link.model'
import { selectLinksState } from 'src/app/projects/project-id/services/store/links/links.selectors'
import { CreateService } from '../services/create.service'
import { DeleteService } from '../services/delete.service'
import { LinksService } from '../services/links.service'
import { UpdateService } from '../services/update.service'
import { MultiCreateService } from '../services/multi/multi-create.service'
import { selectMultiMode } from '../services/store/multi-create/multi.selectors'
import { MultiDeleteService } from '../services/multi/multi-delete.service'

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
  ],
})
export class GridLayoutComponent implements OnInit {
  // selectedBlock: string = ''
  // @ViewChildren(BlockSwitchComponent)
  // blockSwitchComponents!: QueryList<BlockSwitchComponent>
  @ViewChild('gridDiv') gridDiv!: ElementRef
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  canvasHeight?: string
  canvasWidth?: string
  @Output() clickEvent = new EventEmitter<MouseEvent>()
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
    panelJoins?: LinkModel[]
    disconnectionPoints?: DisconnectionPointModel[]
  }>
  project$!: Observable<ProjectModel | undefined>
  inverters$!: Observable<InverterModel[]>
  strings$!: Observable<StringModel[]>
  // trackers$!: Observable<TrackerModel[]>
  panels$!: Observable<PanelModel[]>
  cables$!: Observable<CableModel[]>
  blocks$!: Observable<BlockModel[]>
  joins$!: Observable<LinksState>
  panelJoins$!: Observable<LinkModel[]>
  disconnectionPoints$!: Observable<DisconnectionPointModel[]>
  selected$!: Observable<SelectedState>
  rows = 20
  cols = 40
  private ctx!: CanvasRenderingContext2D

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
    private panelJoinsEntity: LinksEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private createService: CreateService,
    private deleteService: DeleteService,
    private joinsService: LinksService,
    private updateService: UpdateService,
    private multiCreateService: MultiCreateService,
    private multiDeleteService: MultiDeleteService,
  ) {}

  cellAction(location: string, event: MouseEvent): void {
    this.clickEvent.emit(event)
    firstValueFrom(
      this.store.select(selectGridMode).pipe(combineLatestWith(this.store.select(selectMultiMode))),
    ).then(([gridMode, multiMode]) => {
      if (multiMode) {
        switch (gridMode) {
          case GridMode.CREATE:
            this.multiCreateService.multiCreate(location)
            break

          case GridMode.DELETE:
            this.multiDeleteService.multiDelete(location)
            break
        }
      } else {
        switch (gridMode) {
          case GridMode.CREATE:
            this.createService.createSwitch(location)
            break

          case GridMode.DELETE:
            this.deleteService.deleteSwitch(location)
            break

          case GridMode.JOIN:
            this.joinsService.linkSwitch(location)
            break
          /*          case GridMode.MULTICREATE:
                      this.multiCreateService.multiCreate(location)
                      break*/
          default:
            this.createService.createSwitch(location)
            break
        }
      }
    })
  }

  gridDrop(event: CdkDragDrop<any, any>) {
    this.updateService.gridDrop(event)
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.')
  }

  ngOnInit(): void {
    const count = this.invertersEntity.filteredEntities$
    console.log('SELECT ENTITIES', count)
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)
    // this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)
    this.selected$ = this.store.select(selectSelectedUnitAndIds)
    this.joins$ = this.store.select(selectLinksState)
    this.units$ = combineLatest([
      this.invertersEntity.entities$,
      this.stringsEntity.entities$,
      this.panelsEntity.entities$,
      this.cablesEntity.entities$,
      this.joinsEntity.entities$,
      this.panelJoinsEntity.entities$,
      this.disconnectionPointsEntity.entities$,
    ]).pipe(
      map(([inverters, strings, panels, cables, joins, panelJoins, disconnectionPoints]) => ({
        inverters,
        strings,
        panels,
        cables,
        joins,
        panelJoins,
        disconnectionPoints,
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
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }
}
