import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'

import { firstValueFrom, Observable } from 'rxjs'

import { map } from 'rxjs/operators'
import { AppState } from '@shared/data-access/store'
import { BlocksService, PanelsEntityService } from '@grid-layout/data-access/store'
import { PanelModel, StringModel, TotalModel } from '@shared/data-access/models'



@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private store = inject(Store<AppState>)
  private panelsEntity = inject(PanelsEntityService)


  calculateStringTotalsV2(stringModel: StringModel) {
    let totalVoc: number = 0
    let totalVmp: number = 0
    let totalPmax: number = 0
    let totalIsc: number = 0
    let totalImp: number = 0
    firstValueFrom(
      this.panelsEntity.entities$.pipe(
        map((panels) => panels.filter((p) => p.stringId === stringModel.id)),
      ),
    ).then((stringPanels) => {
      stringPanels.forEach((stringPanel) => {
        totalVoc =
          totalVoc + Number((Math.round(stringPanel.openCircuitVoltage! * 100) / 100).toFixed(2))

        totalVmp =
          totalVmp + Number((Math.round(stringPanel.voltageAtMaximumPower! * 100) / 100).toFixed(2))

        totalPmax =
          totalPmax + Number((Math.round(stringPanel.maximumPower! * 100) / 100).toFixed(2))

        if (totalIsc == 0) {
          totalIsc = Number((Math.round(stringPanel.shortCircuitCurrent! * 100) / 100).toFixed(2))
        } else {
          totalIsc = this.getLowerNumber(
            totalIsc,
            Number((Math.round(stringPanel.shortCircuitCurrent! * 100) / 100).toFixed(2)),
          )
        }

        if (totalImp == 0) {
          totalImp = Number((Math.round(stringPanel.currentAtMaximumPower! * 100) / 100).toFixed(2))
        } else {
          totalImp = this.getLowerNumber(
            totalImp,
            Number((Math.round(stringPanel.currentAtMaximumPower! * 100) / 100).toFixed(2)),
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
        totalVoc + Number((Math.round(stringPanel.openCircuitVoltage! * 100) / 100).toFixed(2))

      totalVmp =
        totalVmp + Number((Math.round(stringPanel.voltageAtMaximumPower! * 100) / 100).toFixed(2))

      totalPmax = totalPmax + Number((Math.round(stringPanel.maximumPower! * 100) / 100).toFixed(2))

      if (totalIsc == 0) {
        totalIsc = Number((Math.round(stringPanel.shortCircuitCurrent! * 100) / 100).toFixed(2))
      } else {
        totalIsc = this.getLowerNumber(
          totalIsc,
          Number((Math.round(stringPanel.shortCircuitCurrent! * 100) / 100).toFixed(2)),
        )
      }

      if (totalImp == 0) {
        totalImp = Number((Math.round(stringPanel.currentAtMaximumPower! * 100) / 100).toFixed(2))
      } else {
        totalImp = this.getLowerNumber(
          totalImp,
          Number((Math.round(stringPanel.currentAtMaximumPower! * 100) / 100).toFixed(2)),
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
