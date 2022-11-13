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

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
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
