import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { PanelsService } from '../../../services/panels.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import {
  selectStringsByProjectIdRouteParams,
  selectStringsByTrackerId,
} from '../../../store/strings/strings.selectors'
import { map } from 'rxjs/operators'
import { GridService } from '../../../services/grid.service'
import { selectPanelsByTrackerId } from '../../../store/panels/panels.selectors'
import { combineLatest, Observable } from 'rxjs'
import { selectProjectByRouteParams } from '../../../store/projects/projects.selectors'
import {
  selectInverterById,
  selectInvertersByProjectIdRouteParams,
} from '../../../store/inverters/inverters.selectors'
import {
  selectTrackerById,
  selectTrackersByProjectIdRouteParams,
} from '../../../store/trackers/trackers.selectors'
import { ProjectModel } from '../../../models/project.model'
import { MatMenuTrigger } from '@angular/material/menu'
import { CreateMode } from '../../../store/grid/grid.actions'
import {
  selectCreateMode,
  selectGridMode,
  selectSelectedString,
  selectSelectedStrings,
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
import {
  CreatePanelRequest,
  PanelStateActions,
} from '../../../store/panels/panels.actions'
import { GridMode } from '../../../store/grid/grid-mode.model'
import { GridModeService } from '../../../services/grid/grid-mode.service'
import { PanelsEntityService } from '../../services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../services/cables-entity/cables-entity.service'
import { GridUpdateService } from '../../../services/grid/grid-update.service'

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent implements OnInit {
  @Input() inverters?: InverterModel[]
  @Input() trackers?: TrackerModel[]
  @Input() strings?: StringModel[]
  @Input() panels?: PanelModel[]
  @Input() selectedStringId?: number
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  public context!: CanvasRenderingContext2D
  createMode$?: Observable<CreateMode | undefined>
  createMode?: CreateMode | undefined
  selectedStrings$?: Observable<StringModel[] | undefined>
  selectedString$!: Observable<number>
  occupiedSpots: string[] = []
  takenBlocks: number[] = []
  trackerTree$!: Observable<{
    project?: ProjectModel
    inverter?: InverterModel
    tracker?: TrackerModel
    strings?: StringModel[]
    panels?: PanelModel[]
  }>
  gridState$!: Observable<{
    createMode?: CreateMode
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

  constructor(
    private panelsService: PanelsService,
    private store: Store<AppState>,
    public grid: GridService,
    public gridCell: GridModeService,
    public gridDrag: GridUpdateService,
    private panelsEntity: PanelsEntityService,
    private cablesEntity: CablesEntityService,
  ) {
    /*    this.panels?.forEach((panel) => {
          // console.log(panel?.location)
        })*/
  }

  ngOnInit(): void {
    this.createMode$ = this.store.select(selectCreateMode)
    this.selectedStrings$ = this.store.select(selectSelectedStrings)
    // this.selectedString$ = this.store.select(selectSelectedString)
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.inverters$ = this.store.select(selectInvertersByProjectIdRouteParams)
    this.trackers$ = this.store.select(selectTrackersByProjectIdRouteParams)
    this.strings$ = this.store.select(selectStringsByProjectIdRouteParams)
    this.panels$ = this.panelsEntity.entities$
    // this.panels$ = this.store.select(selectPanelsByProjectIdRouteParams)
    this.cables$ = this.cablesEntity.entities$
    // this.cables$ = this.store.select(selectCablesByProjectIdRouteParams)
    this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)

    this.gridState$ = combineLatest([
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

    /*    this.store
          .select(
            selectPanelsByProjectId({
              projectId: 3,
            }),
          )
          .subscribe((panels) => {
            // console.log(panels)
            panels.forEach((panel) => {
              // console.log(panel?.location)
              this.takenBlocks.push(panel?.location)
            })
            // console.log(this.occupiedSpots)
          })*/
    this.trackerTree$ = combineLatest([
      this.store.select(selectProjectByRouteParams),
      this.store.select(
        selectInverterById({
          id: 11,
        }),
      ),
      this.store.select(
        selectTrackerById({
          id: 6,
        }),
      ),
      this.store.select(
        selectStringsByTrackerId({
          trackerId: 6,
        }),
      ),
      this.store.select(
        selectPanelsByTrackerId({
          trackerId: 6,
        }),
      ),
    ]).pipe(
      map(([project, inverter, tracker, strings, panels]) => ({
        project,
        inverter,
        tracker,
        strings,
        panels,
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
    if (selectedString.id < 1) console.log('select string')

    if (selectedString) {
      /*      const doesExist = this.panels?.find(
              (panel) => panel.location === location,
            )
            if (doesExist) {
              console.log('location taken')
              return
            }*/

      const request: CreatePanelRequest = {
        project_id: selectedString.project_id,
        inverter_id: selectedString.inverter_id,
        tracker_id: selectedString.tracker_id,
        string_id: selectedString.id,
        location,
      }
      this.store.dispatch(PanelStateActions.addPanelHttp({ request }))
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

  async deletePanel(panel: PanelModel) {
    console.log('delete')
    // await this.panelsService.deletePanel(3, panel.id)
  }
}
