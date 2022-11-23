import { Component, OnInit, ViewChild } from '@angular/core'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
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
import { CreateMode } from '../../../store/grid/grid.actions'
import {
  selectCreateMode,
  selectGridMode,
  selectSelectedString,
  selectSelectedStrings,
  selectToJoinArray,
} from '../../../store/grid/grid.selectors'
import { BlockModel } from '../../../models/block.model'
import { selectBlocksByProjectIdRouteParams } from '../../../store/blocks/blocks.selectors'
import { CableModel } from '../../../models/cable.model'
import {
  CableStateActions,
  CreateCableRequest,
  UpdateCableRequest,
} from '../../../store/cable/cable.actions'
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

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
  standalone: true,
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
  project$!: Observable<ProjectModel | undefined>
  inverters$!: Observable<InverterModel[]>
  trackers$!: Observable<TrackerModel[]>
  strings$!: Observable<StringModel[]>
  panels$!: Observable<PanelModel[]>
  cables$!: Observable<CableModel[]>
  blocks$!: Observable<BlockModel[]>
  joins$!: Observable<JoinModel[]>
  toJoinArray$!: Observable<string[]>
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
    public gridJoins: GridJoinService,
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
    // this.cables$ = this.store.select(selectCablesByProjectIdRouteParams)
    this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)
    this.toJoinArray$ = this.store.select(selectToJoinArray)

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
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  async blockDrop(
    event: CdkDragDrop<any, any>,
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    const doesExist = blocks.find(
      (block) => block.location.toString() === event.container.id,
    )

    if (doesExist) {
      console.log('location taken')
      return
    }

    const newLocation = Number(event.container.id)

    const block = event.item.data
    switch (block.model) {
      case UnitModel.PANEL:
        return this.updatePanelLocationV2(project.id, block, event.container.id)
      // break
      case UnitModel.CABLE:
        return this.updateCableLocationV2(project.id, block, newLocation)
      // break
      default:
        break
    }
  }

  updatePanelLocation(
    projectId: number,
    panel: PanelModel,
    newLocation: string,
  ) {
    const update: PanelModel = {
      id: panel.id,
      inverter_id: panel.inverter_id,
      tracker_id: panel.tracker_id,
      string_id: panel.string_id,
      location: panel.location,
      version: panel.version,
    }

    /* const request: UpdatePanelRequest = {
       panel,
       newLocation,
       project_id: projectId,
     }

     this.store.dispatch(PanelStateActions.updatePanelHttp({ request }))*/
    // await this.panelsService.updatePanel(3, update, newLocation)
  }

  updatePanelLocationV2(
    projectId: number,
    panel: PanelModel,
    newLocation: string,
  ) {
    /*    const request: UpdatePanelRequest = {
          panel,
          newLocation,
          project_id: projectId,
        }*/

    const update: PanelModel = {
      ...panel,
      location: newLocation,
    }

    return this.panelsEntity.update(update)
    // return this.store.dispatch(PanelStateActions.updatePanelHttp({ request }))
  }

  updateCableLocationV2(
    projectId: number,
    cable: CableModel,
    newLocation: number,
  ) {
    const request: UpdateCableRequest = {
      cable,
      newLocation,
      project_id: projectId,
    }

    return this.store.dispatch(CableStateActions.updateCableHttp({ request }))
  }

  async updateCableLocation(
    projectId: number,
    panel: PanelModel,
    newLocation: string,
  ) {
    const update: PanelModel = {
      id: panel.id,
      inverter_id: panel.inverter_id,
      tracker_id: panel.tracker_id,
      string_id: panel.string_id,
      location: panel.location,
      version: panel.version,
    }

    await this.panelsService.updatePanelOld(3, update, newLocation)
  }

  async divClick(
    location: string,
    gridState: {
      createMode?: CreateMode
      selectedStrings?: StringModel[]
      selectedString?: StringModel
    },
    project: ProjectModel,
  ) {
    switch (gridState.createMode) {
      case CreateMode.PANEL:
        // await this.createPanelForGrid(location, gridState.selectedString)
        break
      case CreateMode.CABLE:
        // await this.createCableForGrid(location, project)

        break
      default:
        break
    }
  }

  async divClickV2(
    location: number,
    gridState: {
      createMode?: CreateMode
      selectedStrings?: StringModel[]
      selectedString?: StringModel
      gridMode?: GridMode
    },
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    // console.log(location)
    switch (gridState.createMode) {
      case CreateMode.PANEL:
        await this.createPanelForGrid(location, gridState.selectedString)
        break
      case CreateMode.CABLE:
        // await this.createCableForGrid(location, project)
        break
      default:
        break
    }
  }

  async createCableForGrid(location: number, project: ProjectModel) {
    if (location) {
      /*      const doesExist = this.panels?.find(
              (panel) => panel.location === location,
            )*/
      /*      if (doesExist) {
              console.log('location taken')
              return
            }*/
      const inSpot = this.takenBlocks.find((block) => block === location)
      // const inSpot = this.occupiedSpots.find((spot) => spot === location)
      if (inSpot) return console.log('location taken')
      // await this.grid.createCableForGrid(project.id, location, 4)
      /*      const cable: CableModel = {
              id: 0,
              location,
              size: 4,
              project_id: project.id,
            }*/
      const request: CreateCableRequest = {
        location,
        size: 4,
        project_id: project.id,
      }
      this.store.dispatch(CableStateActions.addCableHttp({ request }))
    }
  }

  async createPanelForGrid(location: number, selectedString?: StringModel) {
    console.log(selectedString)
    if (!selectedString) return console.log('select string')
    if (selectedString.id === '') console.log('select string')

    if (selectedString) {
      /*      const doesExist = this.panels?.find(
              (panel) => panel.location === location,
            )
            if (doesExist) {
              console.log('location taken')
              return
            }*/
      /*      const request: CreatePanelRequest = {
              project_id: selectedString.project_id,
              inverter_id: selectedString.inverter_id,
              tracker_id: selectedString.tracker_id,
              string_id: selectedString.id,
              location,
            }
            this.store.dispatch(PanelStateActions.addPanelHttp({ request }))*/
      /*      await this.panelsService.createPanelForGrid(
              3,
              selectedString.inverter_id,
              selectedString.tracker_id,
              selectedString.id,
              location,
              selectedString.color!,
            )*/
    }
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
}
