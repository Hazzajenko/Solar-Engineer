import { Component, OnInit } from '@angular/core'
import { selectInverterById } from '../../../store/inverters/inverters.selectors'
import { selectTrackerById } from '../../../store/trackers/trackers.selectors'
import { selectStringsByTrackerId } from '../../../store/strings/strings.selectors'
import { selectPanelsByTrackerId } from '../../../store/panels/panels.selectors'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { Observable } from 'rxjs'
import { ProjectModel } from '../../../models/project.model'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { selectProjectByRouteParams } from '../../../store/projects/projects.selectors'
import { StatsService } from '../../../services/stats.service'

@Component({
  selector: 'app-tracker-stats',
  templateUrl: './tracker-stats.component.html',
  styleUrls: ['./tracker-stats.component.scss'],
})
export class TrackerStatsComponent implements OnInit {
  project$?: Observable<ProjectModel | undefined>
  inverter$?: Observable<InverterModel | undefined>
  tracker$?: Observable<TrackerModel | undefined>
  strings$?: Observable<StringModel[]>
  panels$?: Observable<PanelModel[]>
  panelAmount: number[] = []
  totalVoc: number[] = []
  totalVmp: number[] = []
  totalPmax: number[] = []
  totalIsc: number[] = []
  totalImp: number[] = []
  trackerTotalVoc: number[] = []
  trackerTotalVmp: number[] = []
  trackerTotalPmax: number[] = []
  trackerTotalIsc: number[] = []
  trackerTotalImp: number[] = []
  invertersTotalVoc: number[] = []
  invertersTotalVmp: number[] = []
  invertersTotalPmax: number[] = []
  invertersTotalIsc: number[] = []
  invertersTotalImp: number[] = []

  constructor(
    private store: Store<AppState>,
    private statsService: StatsService,
  ) {}

  ngOnInit(): void {
    this.statsService.calculateStringTotals()
    // this.statsService.calculateTrackerTotals()
    console.log('trackerVOC', this.trackerTotalVoc)
    console.log('stringsTotalVoc', this.statsService.stringsTotalVoc)
    this.totalVoc = this.statsService.stringsTotalVoc
    this.totalVmp = this.statsService.stringsTotalVmp
    this.totalPmax = this.statsService.stringsTotalPmax
    this.totalIsc = this.statsService.stringsTotalIsc
    this.totalImp = this.statsService.stringsTotalImp
    this.trackerTotalVoc = this.statsService.trackersTotalVoc
    this.trackerTotalVmp = this.statsService.trackersTotalVmp
    this.trackerTotalPmax = this.statsService.trackersTotalPmax
    this.trackerTotalIsc = this.statsService.trackersTotalIsc
    this.trackerTotalImp = this.statsService.trackersTotalImp
    this.invertersTotalVoc = this.statsService.invertersTotalVoc
    this.invertersTotalVmp = this.statsService.invertersTotalVmp
    this.invertersTotalPmax = this.statsService.invertersTotalPmax
    this.invertersTotalIsc = this.statsService.invertersTotalIsc
    this.invertersTotalImp = this.statsService.invertersTotalImp
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.inverter$ = this.store.select(
      selectInverterById({
        id: 11,
      }),
    )
    this.tracker$ = this.store.select(
      selectTrackerById({
        id: 6,
      }),
    )
    this.strings$ = this.store.select(
      selectStringsByTrackerId({
        trackerId: 6,
      }),
    )
    this.panels$ = this.store.select(
      selectPanelsByTrackerId({
        trackerId: 6,
      }),
    )
  }
}
