import { Component, OnInit, ViewChild } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { combineLatest, Observable } from 'rxjs'
import { InverterModel } from '../models/inverter.model'
import { MatMenuTrigger } from '@angular/material/menu'
import {
  selectInverterById,
  selectInvertersByProjectId,
} from '../store/inverters/inverters.selectors'
import {
  selectTrackerById,
  selectTrackersByProjectId,
} from '../store/trackers/trackers.selectors'
import {
  selectSelectedStringId,
  selectStringsByProjectId,
  selectStringsByTrackerId,
} from '../store/strings/strings.selectors'
import {
  selectPanelsByProjectId,
  selectPanelsByTrackerId,
} from '../store/panels/panels.selectors'
import { map } from 'rxjs/operators'
import { TrackerModel } from '../models/tracker.model'
import { StringModel } from '../models/string.model'
import { PanelModel } from '../models/panel.model'
import { ProjectsService } from '../services/projects.service'
import { selectProjectByRouteParams } from '../store/projects/projects.selectors'
import { ProjectModel } from '../models/project.model'
import { StatsService } from '../services/stats.service'

export interface ProjectStore {
  project?: ProjectModel
  inverters?: InverterModel[]
  trackers?: TrackerModel[]
  strings?: StringModel[]
  panels?: PanelModel[]
}

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.scss'],
})
export class ProjectIdComponent implements OnInit {
  menuTopLeftPosition = { x: '0', y: '0' }
  inverterBool: boolean[] = [false, false, false]
  trackerBool: boolean[] = [false, false, false]
  stringBool: boolean[] = [false, false, false]

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger

  store$?: Observable<ProjectStore>
  trackerTree$!: Observable<{
    project?: ProjectModel
    inverter?: InverterModel
    tracker?: TrackerModel
    strings?: StringModel[]
    panels?: PanelModel[]
  }>
  gridState$!: Observable<{ selectedStringId?: number }>
  view?: InverterModel

  constructor(
    private store: Store<AppState>,
    private projects: ProjectsService,
    private statsService: StatsService,
  ) {}

  ngOnInit(): void {
    // this.statsService.calculateStringTotals()
    console.log(this.statsService.stringsTotalVoc)
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

    this.projects.getDataByProjectId(3).then(async () => {})
    this.store$ = combineLatest([
      this.store.select(selectProjectByRouteParams),
      this.store.select(
        selectInvertersByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectTrackersByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectStringsByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectPanelsByProjectId({
          projectId: 3,
        }),
      ),
    ]).pipe(
      map(([project, inverters, trackers, strings, panels]) => ({
        project,
        inverters,
        trackers,
        strings,
        panels,
      })),
    )
    this.gridState$ = combineLatest([
      this.store.select(selectSelectedStringId),
    ]).pipe(
      map(([selectedStringId]) => ({
        selectedStringId,
      })),
    )
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 'px'
    console.log(this.menuTopLeftPosition.x)
    this.menuTopLeftPosition.y = event.clientY + 'px'
    console.log(this.menuTopLeftPosition.y)

    this.matMenuTrigger.openMenu()
  }

  onRouteToInverter(inverter: InverterModel) {}

  click() {
    console.log('click')
  }

  toggleInverter(inverter: InverterModel, index: number) {
    this.inverterBool[index] = !this.inverterBool[index]
    console.log(this.inverterBool[index])
  }

  toggleTracker(tracker: TrackerModel, index: number) {
    this.trackerBool[index] = !this.trackerBool[index]
    console.log(this.trackerBool[index])
  }

  toggleString(stringModel: StringModel, index: number) {
    this.stringBool[index] = !this.stringBool[index]
    console.log(this.stringBool[index])
  }

  updateView(event: InverterModel) {
    console.log(event)
    this.view = event
  }
}
