import { inject, Injectable } from '@angular/core'
import { GridPanelsFacade } from '@grid-layout/data-access'
import { GridPanelModel } from '@shared/data-access/models'

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
	private panelsFacade = inject(GridPanelsFacade)

	calculateStringTotals(panels: GridPanelModel[]) {
		let totalVoc = 0
		let totalVmp = 0
		let totalPmax = 0
		let totalIsc = 0
		let totalImp = 0
		// TODO - this is a hack to get the total Imp and Isc to work
		/*    panels.forEach((stringPanel) => {
     totalVoc =
     totalVoc + Number((Math.round(stringPanel.openCircuitVoltage * 100) / 100).toFixed(2))

     totalVmp =
     totalVmp + Number((Math.round(stringPanel.voltageAtMaximumPower * 100) / 100).toFixed(2))

     totalPmax = totalPmax + Number((Math.round(stringPanel.maximumPower * 100) / 100).toFixed(2))

     if (totalIsc == 0) {
     totalIsc = Number((Math.round(stringPanel.shortCircuitCurrent * 100) / 100).toFixed(2))
     } else {
     totalIsc = this.getLowerNumber(
     totalIsc,
     Number((Math.round(stringPanel.shortCircuitCurrent * 100) / 100).toFixed(2)),
     )
     }

     if (totalImp == 0) {
     totalImp = Number((Math.round(stringPanel.currentAtMaximumPower * 100) / 100).toFixed(2))
     } else {
     totalImp = this.getLowerNumber(
     totalImp,
     Number((Math.round(stringPanel.currentAtMaximumPower * 100) / 100).toFixed(2)),
     )
     }
     })*/

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

	/*calculateStringTotalsAsync(string: StringModel) {
   return this.panelsFacade.allPanels$.pipe(
   map((panels) => panels.filter((p) => p.stringId === string.id)),
   map((stringPanels) => {
   let totalVoc = 0
   let totalVmp = 0
   let totalPmax = 0
   let totalIsc = 0
   let totalImp = 0
   stringPanels.forEach((stringPanel) => {
   totalVoc =
   totalVoc + Number((Math.round(stringPanel.openCircuitVoltage * 100) / 100).toFixed(2))

   totalVmp =
   totalVmp +
   Number((Math.round(stringPanel.voltageAtMaximumPower * 100) / 100).toFixed(2))

   totalPmax =
   totalPmax + Number((Math.round(stringPanel.maximumPower * 100) / 100).toFixed(2))

   if (totalIsc == 0) {
   totalIsc = Number((Math.round(stringPanel.shortCircuitCurrent * 100) / 100).toFixed(2))
   } else {
   totalIsc = this.getLowerNumber(
   totalIsc,
   Number((Math.round(stringPanel.shortCircuitCurrent * 100) / 100).toFixed(2)),
   )
   }

   if (totalImp == 0) {
   totalImp = Number(
   (Math.round(stringPanel.currentAtMaximumPower * 100) / 100).toFixed(2),
   )
   } else {
   totalImp = this.getLowerNumber(
   totalImp,
   Number((Math.round(stringPanel.currentAtMaximumPower * 100) / 100).toFixed(2)),
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
   }),
   )
   }*/

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
