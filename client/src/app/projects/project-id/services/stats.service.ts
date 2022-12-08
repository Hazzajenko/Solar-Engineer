import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { firstValueFrom, Observable } from 'rxjs'
import { StringModel } from '../../models/string.model'
import { selectAllStrings } from '../../store/strings/strings.selectors'
import { PanelModel } from '../../models/panel.model'
import { selectAllPanels } from '../../store/panels/panels.selectors'
import { TrackerModel } from '../../models/tracker.model'
import { selectAllTrackers } from '../../store/trackers/trackers.selectors'
import { InverterModel } from '../../models/inverter.model'
import { selectAllInverters } from '../../store/inverters/inverters.selectors'
import { PanelsEntityService } from './ngrx-data/panels-entity/panels-entity.service'
import { map } from 'rxjs/operators'

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

  constructor(private http: HttpClient, private store: Store<AppState>,
              private panelsEntity: PanelsEntityService) {}

  calculateStringTotalsV2(stringModel: StringModel) {
    let totalVoc: number = 0
    let totalVmp: number = 0
    let totalPmax: number = 0
    let totalIsc: number = 0
    let totalImp: number = 0
    firstValueFrom(this.panelsEntity.entities$.pipe(
      map(panels => panels.filter(p => p.string_id === stringModel.id))
    )).then(stringPanels => {


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
