import { Component, OnInit } from '@angular/core'
import { combineLatest, Observable } from 'rxjs'
import { selectInverterById } from '../../../store/inverters/inverters.selectors'
import { selectTrackerById } from '../../../store/trackers/trackers.selectors'
import { selectStringsByTrackerId } from '../../../store/strings/strings.selectors'
import { selectPanelsByTrackerId } from '../../../store/panels/panels.selectors'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { ProjectModel } from '../../../models/project.model'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { StoreService } from '../../../services/store.service'

@Component({
  selector: 'app-string-stats',
  templateUrl: './string-stats.component.html',
  styleUrls: ['./string-stats.component.scss'],
})
export class StringStatsComponent implements OnInit {
  stats$!: Observable<{
    project?: ProjectModel
    inverter?: InverterModel
    tracker?: TrackerModel
    strings?: StringModel[]
    panels?: PanelModel[]
  }>

  project$?: Observable<ProjectModel | undefined> =
    this.storeService.getProject
  // project$?: Observable<ProjectModel | undefined>
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

  constructor(
    private store: Store<AppState>,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    /*    this.project$ = this.store.select(
          selectProjectByRouteParams,
        )*/

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
    combineLatest([this.strings$, this.panels$]).subscribe(
      ([strings, panels]) => {
        strings.map((string) => {
          this.totalVoc[string.id] = 0
          this.totalVmp[string.id] = 0
          this.totalPmax[string.id] = 0
          this.totalIsc[string.id] = 0
          this.totalImp[string.id] = 0
          const stringPanels = panels.filter(
            (panel) => panel.string_id === string.id,
          )
          stringPanels.forEach((stringPanel) => {
            this.totalVoc[string.id] =
              this.totalVoc[string.id] +
              Number(
                (
                  Math.round(
                    stringPanel.open_circuit_voltage! * 100,
                  ) / 100
                ).toFixed(2),
              )

            this.totalVmp[string.id] =
              this.totalVmp[string.id] +
              Number(
                (
                  Math.round(
                    stringPanel.voltage_at_maximum_power! *
                      100,
                  ) / 100
                ).toFixed(2),
              )

            this.totalPmax[string.id] =
              this.totalPmax[string.id] +
              Number(
                (
                  Math.round(
                    stringPanel.maximum_power! * 100,
                  ) / 100
                ).toFixed(2),
              )

            if (this.totalIsc[string.id] == 0) {
              this.totalIsc[string.id] = Number(
                (
                  Math.round(
                    stringPanel.short_circuit_current! *
                      100,
                  ) / 100
                ).toFixed(2),
              )
            } else {
              this.totalIsc[string.id] =
                this.getLowerNumber(
                  this.totalIsc[string.id],
                  Number(
                    (
                      Math.round(
                        stringPanel.short_circuit_current! *
                          100,
                      ) / 100
                    ).toFixed(2),
                  ),
                )
            }

            if (this.totalImp[string.id] == 0) {
              this.totalImp[string.id] = Number(
                (
                  Math.round(
                    stringPanel.current_at_maximum_power! *
                      100,
                  ) / 100
                ).toFixed(2),
              )
            } else {
              this.totalImp[string.id] =
                this.getLowerNumber(
                  this.totalImp[string.id],
                  Number(
                    (
                      Math.round(
                        stringPanel.current_at_maximum_power! *
                          100,
                      ) / 100
                    ).toFixed(2),
                  ),
                )
            }
          })

          this.totalVoc[string.id] = Number(
            (
              Math.round(this.totalVoc[string.id] * 100) /
              100
            ).toFixed(2),
          )
          this.totalVmp[string.id] = Number(
            (
              Math.round(this.totalVmp[string.id] * 100) /
              100
            ).toFixed(2),
          )
          this.totalPmax[string.id] = Number(
            (
              Math.round(this.totalPmax[string.id] * 100) /
              100
            ).toFixed(2),
          )
          this.totalIsc[string.id] = Number(
            (
              Math.round(this.totalIsc[string.id] * 100) /
              100
            ).toFixed(2),
          )
          this.totalImp[string.id] = Number(
            (
              Math.round(this.totalImp[string.id] * 100) /
              100
            ).toFixed(2),
          )
          console.log(
            `${string.id}`,
            this.totalImp[string.id],
          )
          console.log(
            `${string.id}`,
            this.totalIsc[string.id],
          )
        })
      },
    )
  }

  getLowerNumber(a: number, b: number) {
    if (a < b) return a
    return b
  }
}
