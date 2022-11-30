import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { Observable } from 'rxjs'
import { StringModel } from '../../models/string.model'
import { selectAllStrings } from '../../store/strings/strings.selectors'
import { PanelModel } from '../../models/panel.model'
import { selectAllPanels } from '../../store/panels/panels.selectors'
import { TrackerModel } from '../../models/tracker.model'
import { selectAllTrackers } from '../../store/trackers/trackers.selectors'
import { InverterModel } from '../../models/inverter.model'
import { selectAllInverters } from '../../store/inverters/inverters.selectors'

export interface TotalModel {
  totalVoc: number
  totalVmp: number
  totalPmax: number
  totalIsc: number
  totalImp: number
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  inverters$: Observable<InverterModel[]> =
    this.store.select(selectAllInverters)
  trackers$: Observable<TrackerModel[]> = this.store.select(selectAllTrackers)
  strings$: Observable<StringModel[]> = this.store.select(selectAllStrings)
  panels$: Observable<PanelModel[]> = this.store.select(selectAllPanels)

  gridNumbers: number[] = []
  panelAmount: number[] = []
  stringsTotalVoc: number[] = []
  stringsTotalVmp: number[] = []
  stringsTotalPmax: number[] = []
  stringsTotalIsc: number[] = []
  stringsTotalImp: number[] = []
  trackersTotalVoc: number[] = []
  trackersTotalVmp: number[] = []
  trackersTotalPmax: number[] = []
  trackersTotalIsc: number[] = []
  trackersTotalImp: number[] = []
  invertersTotalVoc: number[] = []
  invertersTotalVmp: number[] = []
  invertersTotalPmax: number[] = []
  invertersTotalIsc: number[] = []
  invertersTotalImp: number[] = []

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  updateStringTotals(
    totalVoc: number[],
    totalVmp: number[],
    totalPmax: number[],
    totalIsc: number[],
    totalImp: number[],
  ) {
    this.stringsTotalVoc = totalVoc
    this.stringsTotalVmp = totalVmp
    this.stringsTotalPmax = totalPmax
    this.stringsTotalIsc = totalIsc
    this.stringsTotalImp = totalImp
  }

  calculateInverterTotals() {
    /*    combineLatest([this.inverters$, this.trackers$]).subscribe(
          ([inverters, trackers]) => {
            inverters.map((inverter) => {
              this.invertersTotalVoc[inverter.id] = 0
              this.invertersTotalVmp[inverter.id] = 0
              this.invertersTotalPmax[inverter.id] = 0
              this.invertersTotalIsc[inverter.id] = 0
              this.invertersTotalImp[inverter.id] = 0
              const inverterTrackers = trackers.filter(
                (tracker) => tracker.inverter_id === inverter.id,
              )
              inverterTrackers.forEach((inverterTracker) => {
                this.invertersTotalVoc[inverter.id] =
                  this.invertersTotalVoc[inverter.id] +
                  this.trackersTotalVoc[inverterTracker.id]

                this.invertersTotalVmp[inverter.id] =
                  this.invertersTotalVmp[inverter.id] +
                  this.trackersTotalVmp[inverterTracker.id]

                this.invertersTotalPmax[inverter.id] =
                  this.invertersTotalPmax[inverter.id] +
                  this.trackersTotalPmax[inverterTracker.id]

                if (this.invertersTotalIsc[inverter.id] == 0) {
                  this.invertersTotalIsc[inverter.id] =
                    this.trackersTotalIsc[inverterTracker.id]
                } else {
                  this.invertersTotalIsc[inverter.id] = this.getLowerNumber(
                    this.invertersTotalIsc[inverter.id],
                    this.trackersTotalIsc[inverterTracker.id],
                  )
                }

                if (this.invertersTotalImp[inverter.id] == 0) {
                  this.invertersTotalImp[inverter.id] =
                    this.trackersTotalImp[inverterTracker.id]
                } else {
                  this.invertersTotalImp[inverter.id] = this.getLowerNumber(
                    this.invertersTotalImp[inverter.id],
                    this.trackersTotalImp[inverterTracker.id],
                  )
                }
              })

              this.invertersTotalVoc[inverter.id] = Number(
                (
                  Math.round(this.invertersTotalVoc[inverter.id] * 100) / 100
                ).toFixed(2),
              )
              this.invertersTotalVmp[inverter.id] = Number(
                (
                  Math.round(this.invertersTotalVmp[inverter.id] * 100) / 100
                ).toFixed(2),
              )
              this.invertersTotalPmax[inverter.id] = Number(
                (
                  Math.round(this.invertersTotalPmax[inverter.id] * 100) / 100
                ).toFixed(2),
              )
              this.invertersTotalIsc[inverter.id] = Number(
                (
                  Math.round(this.invertersTotalIsc[inverter.id] * 100) / 100
                ).toFixed(2),
              )
              this.invertersTotalImp[inverter.id] = Number(
                (
                  Math.round(this.invertersTotalImp[inverter.id] * 100) / 100
                ).toFixed(2),
              )
            })
          },
        )*/
  }

  calculateTrackerTotals() {
    /*    combineLatest([this.trackers$, this.strings$]).subscribe(
          ([trackers, strings]) => {
            trackers.map((tracker) => {
              this.trackersTotalVoc[tracker.id] = 0
              this.trackersTotalVmp[tracker.id] = 0
              this.trackersTotalPmax[tracker.id] = 0
              this.trackersTotalIsc[tracker.id] = 0
              this.trackersTotalImp[tracker.id] = 0
              const trackerStrings = strings.filter(
                (string) => string.tracker_id === tracker.id,
              )
              /!*          trackerStrings.forEach((trackerString) => {
                          this.trackersTotalVoc[tracker.id] =
                            this.trackersTotalVoc[tracker.id] +
                            this.stringsTotalVoc[trackerString.id]

                          this.trackersTotalVmp[tracker.id] =
                            this.trackersTotalVmp[tracker.id] +
                            this.stringsTotalVmp[trackerString.id]

                          this.trackersTotalPmax[tracker.id] =
                            this.trackersTotalPmax[tracker.id] +
                            this.stringsTotalPmax[trackerString.id]

                          if (this.trackersTotalIsc[tracker.id] == 0) {
                            this.trackersTotalIsc[tracker.id] =
                              this.stringsTotalIsc[trackerString.id]
                          } else {
                            this.trackersTotalIsc[tracker.id] = this.getLowerNumber(
                              this.trackersTotalIsc[tracker.id],
                              this.stringsTotalIsc[trackerString.id],
                            )
                          }

                          if (this.trackersTotalImp[tracker.id] == 0) {
                            this.trackersTotalImp[tracker.id] =
                              this.stringsTotalImp[trackerString.id]
                          } else {
                            this.trackersTotalImp[tracker.id] = this.getLowerNumber(
                              this.trackersTotalImp[tracker.id],
                              this.stringsTotalImp[trackerString.id],
                            )
                          }
                        })*!/

              this.trackersTotalVoc[tracker.id] = Number(
                (Math.round(this.trackersTotalVoc[tracker.id] * 100) / 100).toFixed(
                  2,
                ),
              )
              this.trackersTotalVmp[tracker.id] = Number(
                (Math.round(this.trackersTotalVmp[tracker.id] * 100) / 100).toFixed(
                  2,
                ),
              )
              this.trackersTotalPmax[tracker.id] = Number(
                (
                  Math.round(this.trackersTotalPmax[tracker.id] * 100) / 100
                ).toFixed(2),
              )
              this.trackersTotalIsc[tracker.id] = Number(
                (Math.round(this.trackersTotalIsc[tracker.id] * 100) / 100).toFixed(
                  2,
                ),
              )
              this.trackersTotalImp[tracker.id] = Number(
                (Math.round(this.trackersTotalImp[tracker.id] * 100) / 100).toFixed(
                  2,
                ),
              )
            })
            this.calculateInverterTotals()
          },
        )*/
  }

  calculateStringTotals(stringModel: StringModel, stringPanels: PanelModel[]) {
    let totalVoc: number = 0
    let totalVmp: number = 0
    let totalPmax: number = 0
    let totalIsc: number = 0
    let totalImp: number = 0
    stringPanels.forEach((stringPanel) => {
      totalVoc =
        totalVoc +
        Number(
          (Math.round(stringPanel.open_circuit_voltage! * 100) / 100).toFixed(
            2,
          ),
        )

      totalVmp =
        totalVmp +
        Number(
          (
            Math.round(stringPanel.voltage_at_maximum_power! * 100) / 100
          ).toFixed(2),
        )

      totalPmax =
        totalPmax +
        Number((Math.round(stringPanel.maximum_power! * 100) / 100).toFixed(2))

      if (totalIsc == 0) {
        totalIsc = Number(
          (Math.round(stringPanel.short_circuit_current! * 100) / 100).toFixed(
            2,
          ),
        )
      } else {
        totalIsc = this.getLowerNumber(
          totalIsc,
          Number(
            (
              Math.round(stringPanel.short_circuit_current! * 100) / 100
            ).toFixed(2),
          ),
        )
      }

      if (totalImp == 0) {
        totalImp = Number(
          (
            Math.round(stringPanel.current_at_maximum_power! * 100) / 100
          ).toFixed(2),
        )
      } else {
        totalImp = this.getLowerNumber(
          totalImp,
          Number(
            (
              Math.round(stringPanel.current_at_maximum_power! * 100) / 100
            ).toFixed(2),
          ),
        )
      }
    })

    totalVoc = Number((Math.round(totalVoc * 100) / 100).toFixed(2))
    totalVmp = Number((Math.round(totalVmp * 100) / 100).toFixed(2))
    totalPmax = Number((Math.round(totalPmax * 100) / 100).toFixed(2))
    totalIsc = Number((Math.round(totalIsc * 100) / 100).toFixed(2))
    totalImp = Number((Math.round(totalImp * 100) / 100).toFixed(2))

    const totals: TotalModel = {
      totalVoc,
      totalVmp,
      totalPmax,
      totalIsc,
      totalImp,
    }

    return totals
  }

  calculateStringTotalsOld() {
    /*combineLatest([this.strings$, this.panels$]).subscribe(
      ([strings, panels]) => {
        strings.map((string) => {
          this.stringsTotalVoc[string.id] = 0
          this.stringsTotalVmp[string.id] = 0
          this.stringsTotalPmax[string.id] = 0
          this.stringsTotalIsc[string.id] = 0
          this.stringsTotalImp[string.id] = 0
          const stringPanels = panels.filter(
            (panel) => panel.string_id === string.id,
          )
          stringPanels.forEach((stringPanel) => {
            this.stringsTotalVoc[string.id] =
              this.stringsTotalVoc[string.id] +
              Number(
                (
                  Math.round(stringPanel.open_circuit_voltage! * 100) / 100
                ).toFixed(2),
              )

            this.stringsTotalVmp[string.id] =
              this.stringsTotalVmp[string.id] +
              Number(
                (
                  Math.round(stringPanel.voltage_at_maximum_power! * 100) / 100
                ).toFixed(2),
              )

            this.stringsTotalPmax[string.id] =
              this.stringsTotalPmax[string.id] +
              Number(
                (Math.round(stringPanel.maximum_power! * 100) / 100).toFixed(2),
              )

            if (this.stringsTotalIsc[string.id] == 0) {
              this.stringsTotalIsc[string.id] = Number(
                (
                  Math.round(stringPanel.short_circuit_current! * 100) / 100
                ).toFixed(2),
              )
            } else {
              this.stringsTotalIsc[string.id] = this.getLowerNumber(
                this.stringsTotalIsc[string.id],
                Number(
                  (
                    Math.round(stringPanel.short_circuit_current! * 100) / 100
                  ).toFixed(2),
                ),
              )
            }

            if (this.stringsTotalImp[string.id] == 0) {
              this.stringsTotalImp[string.id] = Number(
                (
                  Math.round(stringPanel.current_at_maximum_power! * 100) / 100
                ).toFixed(2),
              )
            } else {
              this.stringsTotalImp[string.id] = this.getLowerNumber(
                this.stringsTotalImp[string.id],
                Number(
                  (
                    Math.round(stringPanel.current_at_maximum_power! * 100) /
                    100
                  ).toFixed(2),
                ),
              )
            }
          })

          this.stringsTotalVoc[string.id] = Number(
            (Math.round(this.stringsTotalVoc[string.id] * 100) / 100).toFixed(
              2,
            ),
          )
          this.stringsTotalVmp[string.id] = Number(
            (Math.round(this.stringsTotalVmp[string.id] * 100) / 100).toFixed(
              2,
            ),
          )
          this.stringsTotalPmax[string.id] = Number(
            (Math.round(this.stringsTotalPmax[string.id] * 100) / 100).toFixed(
              2,
            ),
          )
          this.stringsTotalIsc[string.id] = Number(
            (Math.round(this.stringsTotalIsc[string.id] * 100) / 100).toFixed(
              2,
            ),
          )
          this.stringsTotalImp[string.id] = Number(
            (Math.round(this.stringsTotalImp[string.id] * 100) / 100).toFixed(
              2,
            ),
          )
        })
        this.calculateTrackerTotals()
      },
    )*/
  }

  getLowerNumber(a: number, b: number) {
    if (a < b) return a
    return b
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  stringSequence(n: number): Array<string> {
    return Array(n)
  }
}
