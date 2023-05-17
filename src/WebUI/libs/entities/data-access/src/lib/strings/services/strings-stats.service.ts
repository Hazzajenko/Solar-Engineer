import { Injectable } from '@angular/core'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { injectStringsStore } from '../store'
import { assertNotNull } from '@shared/utils'
import { injectPanelConfigsStore } from '../../panel-configs'
import { CanvasPanel, PanelConfig } from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class StringsStatsService {
	private _selectedStore = injectSelectedStore()
	private _stringsStore = injectStringsStore()
	private _panelConfigsStore = injectPanelConfigsStore()

	calculateStringStatsForSelectedString() {
		const selectedStringId = this._selectedStore.selectedStringId
		assertNotNull(selectedStringId)
		// if (!selectedString) return
		const stringWithPanels = this._stringsStore.getStringByIdWithPanels(selectedStringId)
		assertNotNull(stringWithPanels)
		const { string, panels } = stringWithPanels
		// const stringStats = this.calculateStringStats(string, panels)
		// console.log('stringStats', string, panels)

		const panelsWithSpecs = panels.map((panel) => {
			const panelConfig = this._panelConfigsStore.getById(panel.panelConfigId)
			assertNotNull(panelConfig)
			return mapPanelToPanelWithConfig(panel, panelConfig)
		})

		const { totalVoc, totalVmp } = this.calculateStringVoltage(panelsWithSpecs)
		const { totalIsc, totalImp } = this.calculateStringCurrent(panelsWithSpecs)
		const { totalPower } = this.calculateStringPower(panelsWithSpecs)

		const stringStats = {
			totalVoc,
			totalVmp,
			totalIsc,
			totalImp,
			totalPower,
		}

		console.log('stringStats', stringStats)
		/*
		 panels.forEach((panel) => {
		 const panelConfig = this._panelConfigsStore.getById(panel.panelConfigId)
		 assertNotNull(panelConfig)

		 // const { brand: { dim } } = panelConfig
		 // console.log('panelType', panelType)
		 })*/
	}

	private calculateStringVoltage(panelsWithSpecs: PanelWithConfig[]) {
		let totalVoc = 0
		let totalVmp = 0
		panelsWithSpecs.forEach((panel) => {
			totalVoc += panel.openCircuitVoltage
			totalVmp += panel.voltageAtMaximumPower
		})
		return { totalVoc, totalVmp }
	}

	private calculateStringCurrent(panelsWithSpecs: PanelWithConfig[]) {
		let totalIsc = panelsWithSpecs[0].shortCircuitCurrent
		let totalImp = panelsWithSpecs[0].currentAtMaximumPower
		panelsWithSpecs.forEach((panel) => {
			totalIsc += getSmallerNumberOutOfTwoNumbers(totalIsc, panel.shortCircuitCurrent)
			totalImp += getSmallerNumberOutOfTwoNumbers(totalImp, panel.openCircuitVoltage)
		})
		return { totalIsc, totalImp }
	}

	private calculateStringPower(panelsWithSpecs: PanelWithConfig[]) {
		let totalPower = 0
		panelsWithSpecs.forEach((panel) => {
			totalPower += panel.maximumPower
		})
		return { totalPower }
	}
}

export type PanelWithConfig = Pick<CanvasPanel, 'id'> &
	Omit<PanelConfig, 'name' | 'id' | 'brand' | 'model'>

function mapPanelToPanelWithConfig(panel: CanvasPanel, panelConfig: PanelConfig): PanelWithConfig {
	const {
		maximumPowerTemp,
		openCircuitVoltage,
		openCircuitVoltageTemp,
		shortCircuitCurrentTemp,
		voltageAtMaximumPower,
		shortCircuitCurrent,
		currentAtMaximumPower,
		maximumPower,
		weight,
		width,
		length,
	} = panelConfig
	return {
		id: panel.id,
		maximumPowerTemp,
		openCircuitVoltage,
		openCircuitVoltageTemp,
		shortCircuitCurrentTemp,
		voltageAtMaximumPower,
		shortCircuitCurrent,
		currentAtMaximumPower,
		maximumPower,
		weight,
		width,
		length,
	} as PanelWithConfig
}

const getSmallerNumberOutOfTwoNumbers = (a: number, b: number) => (a < b ? a : b)
/*function getSmallerNumberOutOfTwoNumbers(a: number, b: number) {
 return a < b ? a : b
 }*/

/*export type PanelWithConfig = {
 id: panel.id,
 maximumPowerTemp,
 openCircuitVoltage,
 openCircuitVoltageTemp,
 shortCircuitCurrentTemp,
 voltageAtMaximumPower,
 shortCircuitCurrent,
 currentAtMaximumPower,
 maximumPower,
 weight,
 panelLength,
 panelWidth,
 }*/

// export type StringStats = {
// 	stringVoltage: number
// 	stringCurrent: number
// 	stringPower: number
// 	stringLength: number
// 	stringWidth: number
// 	stringWeight: number
// 	stringPanels: {
// 		panelId: string & {
// 			readonly _type: 'panelId'
// 		}
// 		panelVoltage: number
// 		panelCurrent: number
// 		panelPower: number
// 		panelLength: number
// 		panelWidth: number
// 		panelWeight: number
// 	}[]
// }
