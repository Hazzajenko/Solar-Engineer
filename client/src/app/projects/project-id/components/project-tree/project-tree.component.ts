import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { Sort } from '@angular/material/sort'
import { MatMenuTrigger } from '@angular/material/menu'
import { InvertersService } from '../../../services/inverters.service'
import { TrackersService } from '../../../services/trackers.service'
import { StringsService } from '../../../services/strings.service'
import { PanelsService } from '../../../services/panels.service'
import { Observable } from 'rxjs'
import { ProjectModel } from '../../../models/project.model'
import { selectProjectByRouteParams } from '../../../store/projects/projects.selectors'
import { selectInvertersByProjectIdRouteParams } from '../../../store/inverters/inverters.selectors'
import { selectTrackersByProjectIdRouteParams } from '../../../store/trackers/trackers.selectors'
import { selectStringsByProjectIdRouteParams } from '../../../store/strings/strings.selectors'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { StatsService } from '../../../services/stats.service'
import { PanelsEntityService } from '../../services/panels-entity/panels-entity.service'

@Component({
  selector: 'app-project-tree',
  templateUrl: './project-tree.component.html',
  styleUrls: ['./project-tree.component.scss'],
})
export class ProjectTreeComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger
  /*  @Input() inverters?: InverterModel[]
    @Input() trackers?: TrackerModel[]
    @Input() strings?: StringModel[]
    @Input() panels?: PanelModel[]*/
  // project?: ProjectModel
  project$!: Observable<ProjectModel | undefined>
  inverters$!: Observable<InverterModel[]>
  trackers$!: Observable<TrackerModel[]>
  strings$!: Observable<StringModel[]>
  panels$!: Observable<PanelModel[]>
  @Output() inverterView = new EventEmitter<InverterModel>()
  @Output() reRenderRoot = new EventEmitter<boolean>()

  menuTopLeftPosition = { x: '0', y: '0' }

  inverterBool: boolean[] = []
  trackerBool: boolean[] = []
  stringBool: boolean[] = []

  constructor(
    private invertersService: InvertersService,
    private trackersService: TrackersService,
    private stringsService: StringsService,
    private panelsService: PanelsService,
    private store: Store<AppState>,
    public stats: StatsService,
    private panelsEntity: PanelsEntityService,
  ) {}

  ngOnInit(): void {
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.inverters$ = this.store.select(selectInvertersByProjectIdRouteParams)
    this.trackers$ = this.store.select(selectTrackersByProjectIdRouteParams)
    this.strings$ = this.store.select(selectStringsByProjectIdRouteParams)
    // this.panels$ = this.store.select(selectPanelsByProjectIdRouteParams)
    this.panels$ = this.panelsEntity.entities$
    /*    this.store.select(selectProjectByRouteParams).subscribe((project) => {
          if (project) {
            this.project = project
            this.inverters$ = this.store.select(
              selectInvertersByProjectId({
                projectId: project.id,
              }),
            )
            this.trackers$ = this.store.select(
              selectTrackersByProjectId({
                projectId: project.id,
              }),
            )
            this.strings$ = this.store.select(
              selectStringsByProjectId({
                projectId: project.id,
              }),
            )
            this.panels$ = this.store.select(
              selectPanelsByProjectId({
                projectId: project.id,
              }),
            )
          }
        })*/
  }

  toggleInverter(inverter: InverterModel) {
    this.inverterBool[inverter.id] = !this.inverterBool[inverter.id]
    // console.log(this.inverterBool[inverter.id])
  }

  toggleTracker(tracker: TrackerModel) {
    this.trackerBool[tracker.id] = !this.trackerBool[tracker.id]
    // console.log(this.trackerBool[tracker.id])
  }

  toggleString(stringModel: StringModel) {
    this.stringBool[stringModel.id] = !this.stringBool[stringModel.id]
    // console.log(this.stringBool[stringModel.id])
  }

  sortData($event: Sort) {}

  onRightClick(event: MouseEvent, inverter: InverterModel) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 'px'
    // console.log(this.menuTopLeftPosition.x)
    this.menuTopLeftPosition.y = event.clientY + 'px'
    // console.log(this.menuTopLeftPosition.y)
    this.matMenuTrigger.menuData = { item: inverter }

    this.matMenuTrigger.openMenu()
  }

  openMenu(event: MouseEvent, inverter: InverterModel) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 'px'
    // console.log(this.menuTopLeftPosition.x)
    this.menuTopLeftPosition.y = event.clientY + 'px'
    // console.log(this.menuTopLeftPosition.y)
    this.matMenuTrigger.menuData = { item: inverter }

    this.matMenuTrigger.openMenu()
  }

  click() {
    // console.log('click')
  }

  selectNewView(inverter: InverterModel) {
    this.inverterView.emit(inverter)
  }

  async createInverter(projectId: number) {
    await this.invertersService.createInverterByProjectId(projectId)
  }

  async createTracker(projectId: number, inverter: InverterModel) {
    await this.trackersService.createTrackers(projectId, inverter.id)
  }

  async createString(
    projectId: number,
    inverter: InverterModel,
    tracker: TrackerModel,
  ) {
    await this.stringsService.createString(
      projectId,
      inverter.id,
      tracker.id,
      'new string',
    )
  }

  async createPanel(
    projectId: number,
    inverter: InverterModel,
    tracker: TrackerModel,
    stringModel: StringModel,
  ) {
    if (stringModel.panel_amount) {
      let panel_amount = stringModel.panel_amount + 1

      const updateString: StringModel = {
        id: stringModel.id,
        project_id: stringModel.project_id,
        inverter_id: stringModel.inverter_id,
        tracker_id: stringModel.tracker_id,
        model: 2,
        panel_amount,
        name: stringModel.name,
        is_in_parallel: stringModel.is_in_parallel,
        version: stringModel.version,
        created_at: stringModel.created_at,
      }
      await this.panelsService.createPanel(
        projectId,
        inverter.id,
        tracker.id,
        updateString.id,
      )
    } else {
      const updateString: StringModel = {
        id: stringModel.id,
        project_id: stringModel.project_id,
        inverter_id: stringModel.inverter_id,
        tracker_id: stringModel.tracker_id,
        model: 2,
        panel_amount: 1,
        name: stringModel.name,
        is_in_parallel: stringModel.is_in_parallel,
        version: stringModel.version,
        created_at: stringModel.created_at,
      }
      await this.panelsService.createPanel(
        projectId,
        inverter.id,
        tracker.id,
        updateString.id,
      )
    }
  }
}
