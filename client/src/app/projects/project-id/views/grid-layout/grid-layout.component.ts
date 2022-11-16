import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
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
import {
  selectPanelsByProjectId,
  selectPanelsByProjectIdRouteParams,
  selectPanelsByTrackerId,
} from '../../../store/panels/panels.selectors'
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
  selectSelectedString,
  selectSelectedStrings,
} from '../../../store/grid/grid.selectors'

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
  }>
  project$!: Observable<ProjectModel | undefined>
  inverters$!: Observable<InverterModel[]>
  trackers$!: Observable<TrackerModel[]>
  strings$!: Observable<StringModel[]>
  panels$!: Observable<PanelModel[]>

  constructor(
    private panelsService: PanelsService,
    private store: Store<AppState>,
    public grid: GridService,
  ) {
    this.panels?.forEach((panel) => {
      // console.log(panel?.location)
    })
  }

  ngOnInit(): void {
    this.createMode$ = this.store.select(selectCreateMode)
    this.selectedStrings$ = this.store.select(selectSelectedStrings)
    // this.selectedString$ = this.store.select(selectSelectedString)
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.inverters$ = this.store.select(selectInvertersByProjectIdRouteParams)
    this.trackers$ = this.store.select(selectTrackersByProjectIdRouteParams)
    this.strings$ = this.store.select(selectStringsByProjectIdRouteParams)
    this.panels$ = this.store.select(selectPanelsByProjectIdRouteParams)

    this.gridState$ = combineLatest([
      this.store.select(selectCreateMode),
      this.store.select(selectSelectedStrings),
      this.store.select(selectSelectedString),
    ]).pipe(
      map(([createMode, selectedStrings, selectedString]) => ({
        createMode,
        selectedStrings,
        selectedString,
      })),
    )

    this.store
      .select(
        selectPanelsByProjectId({
          projectId: 3,
        }),
      )
      .subscribe((panels) => {
        // console.log(panels)
        panels.forEach((panel) => {
          // console.log(panel?.location)
          this.occupiedSpots.push(panel?.location)
        })
        // console.log(this.occupiedSpots)
      })
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

  async taskDrop(event: CdkDragDrop<PanelModel, any>) {
    moveItemInArray(this.panels!, event.previousIndex, event.currentIndex)

    const panel = event.item.data
    const update: PanelModel = {
      id: panel.id,
      inverter_id: panel.inverter_id,
      tracker_id: panel.tracker_id,
      string_id: panel.string_id,
      location: event.container.id,
      version: panel.version,
    }
    const doesExist = this.panels?.find(
      (panel) => panel.location === event.container.id,
    )
    if (doesExist) {
      console.log('location taken')
      return
    }
    await this.panelsService.updatePanel(3, update)
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
        await this.createPanelForGrid(location, gridState.selectedString)
        break
      case CreateMode.CABLE:
        await this.createCableForGrid(location, project)
        break
      default:
        break
    }
  }

  async createCableForGrid(location: string, project: ProjectModel) {
    if (location) {
      const doesExist = this.panels?.find(
        (panel) => panel.location === location,
      )
      if (doesExist) {
        console.log('location taken')
        return
      }
      const inSpot = this.occupiedSpots.find((spot) => spot === location)
      if (inSpot) return console.log('location taken')
      await this.grid.createCableForGrid(project.id, location, 4)
    }
  }

  async createPanelForGrid(location: string, selectedString?: StringModel) {
    if (!selectedString) return console.log('select string')
    if (selectedString.id < 1) console.log('select string')

    if (selectedString) {
      const doesExist = this.panels?.find(
        (panel) => panel.location === location,
      )
      if (doesExist) {
        console.log('location taken')
        return
      }
      await this.panelsService.createPanelForGrid(
        3,
        selectedString.inverter_id,
        selectedString.tracker_id,
        selectedString.id,
        location,
        selectedString.color!,
      )
    }
  }

  onRightClick(event: MouseEvent, panel: PanelModel) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    // console.log(this.menuTopLeftPosition.x)
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { panel }

    this.matMenuTrigger.openMenu()
  }

  click() {}

  async deletePanel(panel: PanelModel) {
    console.log('delete')
    await this.panelsService.deletePanel(3, panel.id)
  }
}
