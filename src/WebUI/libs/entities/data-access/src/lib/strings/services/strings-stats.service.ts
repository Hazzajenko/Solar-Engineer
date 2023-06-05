import { inject, Injectable } from '@angular/core'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { injectStringsStore } from '../store'
import { assertNotNull } from '@shared/utils'
import { injectPanelConfigsStore } from '../../panel-configs'
import { PanelConfigModel, PanelModel, StringId } from '@entities/shared'
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

	calculateStringStatsForSelectedString() {
		const selectedStringId = this._selectedStore.selectedStringId
		assertNotNull(selectedStringId)
		const stringPanels = this._panelsStore.select.getByStringId(selectedStringId)

		const panelsWithSpecs = stringPanels.map((panel) => {
			const panelConfig = this._panelConfigsStore.select.getById(panel.panelConfigId)
			assertNotNull(panelConfig)
			return mapPanelToPanelWithConfig(panel, panelConfig)
		})

		const { totalVoc, totalVmp } = this.calculateStringVoltage(panelsWithSpecs)
		const { totalIsc, totalImp } = this.calculateStringCurrent(panelsWithSpecs)
		const { totalPmax } = this.calculateStringPower(panelsWithSpecs)

		const { amountOfChains, amountOfLinks, panelsWithoutLinks } =
			this.calculateStringPanelLinkStatsForString(selectedStringId, stringPanels)

		return {
			totalVoc: `VOC: ${totalVoc.toFixed(2)} V`,
			totalVmp: `VMP: ${totalVmp.toFixed(2)} V`,
			totalIsc: `ISC: ${totalIsc.toFixed(2)} A`,
			totalImp: `IMP: ${totalImp.toFixed(2)} A`,
			totalPmax: `PMAX: ${totalPmax.toFixed(2)} W`,
			amountOfChains: `Chains: ${amountOfChains}`,
			amountOfLinks: `Links: ${amountOfLinks}`,
			panelsWithoutLinks: `Panels without links: ${panelsWithoutLinks}`,
		}
	}

	calculateStringPanelLinkStatsForString(stringId: StringId, stringPanels: PanelModel[]) {
		const stringPanelLinkChains = this._panelLinks.getPanelLinkOrderForString(stringId)
		const amountOfChains = stringPanelLinkChains.length
		const amountOfLinks = stringPanelLinkChains.reduce((acc, chain) => acc + chain.length, 0)
		const panelsWithoutLinks = stringPanels.filter((panel) => {
			return !stringPanelLinkChains.some((chain) =>
				chain.some(
					(link) => link.positivePanelId === panel.id || link.negativePanelId === panel.id,
				),
			)
		}).length
		return {
			amountOfChains,
			amountOfLinks,
			panelsWithoutLinks,
		}
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

export type PanelWithConfig = Pick<PanelModel, 'id'> &
	Omit<PanelConfigModel, 'fullName' | 'id' | 'brand' | 'model'>

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

function mapPanelToPanelWithConfig(
	panel: PanelModel,
	panelConfig: PanelConfigModel,
): PanelWithConfig {
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
