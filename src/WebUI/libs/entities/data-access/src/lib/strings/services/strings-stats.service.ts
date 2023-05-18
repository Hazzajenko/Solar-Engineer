import { inject, Injectable } from '@angular/core'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { injectStringsStore } from '../store'
import { assertNotNull } from '@shared/utils'
import { injectPanelConfigsStore } from '../../panel-configs'
import { CanvasPanel, PanelConfig } from '@entities/shared'
import { injectPanelsStore } from '../../panels'
import { injectPanelLinksStore, PanelLinksService } from '../../panel-links'

@Injectable({
	providedIn: 'root',
})
export class StringsStatsService {
	private _selectedStore = injectSelectedStore()
	private _stringsStore = injectStringsStore()
	private _panelsStore = injectPanelsStore()
	private _panelConfigsStore = injectPanelConfigsStore()
	private _panelLinks = inject(PanelLinksService)
	private _panelLinksStore = injectPanelLinksStore()

	calculateStringStatsForSelectedString(): StringStatStrings {
		const selectedStringId = this._selectedStore.selectedStringId
		assertNotNull(selectedStringId)
		const stringPanels = this._panelsStore.getByStringId(selectedStringId)

		const panelsWithSpecs = stringPanels.map((panel) => {
			const panelConfig = this._panelConfigsStore.getById(panel.panelConfigId)
			assertNotNull(panelConfig)
			return mapPanelToPanelWithConfig(panel, panelConfig)
		})

		const { totalVoc, totalVmp } = this.calculateStringVoltage(panelsWithSpecs)
		const { totalIsc, totalImp } = this.calculateStringCurrent(panelsWithSpecs)
		const { totalPmax } = this.calculateStringPower(panelsWithSpecs)

		return {
			totalVoc: `VOC: ${totalVoc.toFixed(2)} V`,
			totalVmp: `VMP: ${totalVmp.toFixed(2)} V`,
			totalIsc: `ISC: ${totalIsc.toFixed(2)} A`,
			totalImp: `IMP: ${totalImp.toFixed(2)} A`,
			totalPmax: `PMAX: ${totalPmax.toFixed(2)} W`,
		}
		/*		return {
		 totalVoc,
		 totalVmp,
		 totalIsc,
		 totalImp,
		 totalPmax,
		 }*/
		/*
		 // console.log('stringStats', stringStats)

		 const stringStatStrings = {
		 totalVoc: `${totalVoc.toFixed(2)} V`,
		 totalVmp: `${totalVmp.toFixed(2)} V`,
		 totalIsc: `${totalIsc.toFixed(2)} A`,
		 totalImp: `${totalImp.toFixed(2)} A`,
		 totalPmax: `${totalPmax.toFixed(2)} W`,
		 }

		 // console.log('stringStatStrings', stringStatStrings)

		 return stringStatStrings*/
	}

	calculateStringPanelLinkStatsForString(stringId: string) {
		const panelLinks = this._panelLinksStore.getByStringId(stringId)
		const panelLinksInJoinedOrder = this._panelLinks.getPanelLinkOrderForString(stringId)
		// const panelLinksInJoinedOrder = this._panelLinksStore.getPanelLinksInJoinedOrder(panelLinks)
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
		let totalPmax = 0
		panelsWithSpecs.forEach((panel) => {
			totalPmax += panel.maximumPower
		})
		return { totalPmax }
	}
}

export type PanelWithConfig = Pick<CanvasPanel, 'id'> &
	Omit<PanelConfig, 'name' | 'id' | 'brand' | 'model'>

export type StringStats = {
	totalVoc: number
	totalVmp: number
	totalIsc: number
	totalImp: number
	totalPmax: number
}

export type StringStatStrings = {
	totalVoc: string
	totalVmp: string
	totalIsc: string
	totalImp: string
	totalPmax: string
}

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
