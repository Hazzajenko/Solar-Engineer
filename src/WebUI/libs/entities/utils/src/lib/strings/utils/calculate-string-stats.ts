import { PanelLinkModel, PanelModel, PanelWithConfig } from '@entities/shared'
import { getSmallerNumberOutOfTwoNumbers } from '@shared/utils'
import { getPanelLinkOrderSeparateChains } from '../../panel-links'

export const calculateStringStatsForSelectedString = (
	stringPanels: PanelModel[],
	stringPanelLinks: PanelLinkModel[],
	panelsWithSpecs: PanelWithConfig[],
) => {
	const { totalVoc, totalVmp } = calculateStringVoltage(panelsWithSpecs)
	const { totalIsc, totalImp } = calculateStringCurrent(panelsWithSpecs)
	const { totalPmax } = calculateStringPower(panelsWithSpecs)

	const stringPanelLinksChains = getPanelLinkOrderSeparateChains(stringPanelLinks)

	const { amountOfChains, amountOfLinks, panelsWithoutLinks } =
		calculateStringPanelLinkStatsForString(stringPanels, stringPanelLinksChains)

	return {
		totalVoc,
		totalVmp,
		totalIsc,
		totalImp,
		totalPmax,
		amountOfChains,
		amountOfLinks,
		panelsWithoutLinks,
	}
}

export const calculateStringPanelLinkStatsForString = (
	stringPanels: PanelModel[],
	stringPanelLinkChains: PanelLinkModel[][],
) => {
	const amountOfChains = stringPanelLinkChains.length
	const amountOfLinks = stringPanelLinkChains.reduce((acc, chain) => acc + chain.length, 0)
	const panelsWithoutLinks = stringPanels.filter((panel) => {
		return !stringPanelLinkChains.some((chain) =>
			chain.some((link) => link.positivePanelId === panel.id || link.negativePanelId === panel.id),
		)
	}).length
	return {
		amountOfChains: `${amountOfChains}`,
		amountOfLinks: `${amountOfLinks}`,
		panelsWithoutLinks: `${panelsWithoutLinks}`,
	}
}

export const calculateStringVoltage = (panelsWithSpecs: PanelWithConfig[]) => {
	let totalVoc = 0
	let totalVmp = 0
	panelsWithSpecs.forEach((panel) => {
		totalVoc += panel.openCircuitVoltage
		totalVmp += panel.voltageAtMaximumPower
	})
	return {
		totalVoc: totalVoc.toFixed(2),
		totalVmp: totalVmp.toFixed(2),
	}
}

export const calculateStringCurrent = (panelsWithSpecs: PanelWithConfig[]) => {
	let totalIsc = panelsWithSpecs[0].shortCircuitCurrent
	let totalImp = panelsWithSpecs[0].currentAtMaximumPower
	panelsWithSpecs.forEach((panel) => {
		totalIsc += getSmallerNumberOutOfTwoNumbers(totalIsc, panel.shortCircuitCurrent)
		totalImp += getSmallerNumberOutOfTwoNumbers(totalImp, panel.openCircuitVoltage)
	})
	return {
		totalIsc: totalIsc.toFixed(2),
		totalImp: totalImp.toFixed(2),
	}
}

export const calculateStringPower = (panelsWithSpecs: PanelWithConfig[]) => {
	let totalPmax = 0
	panelsWithSpecs.forEach((panel) => {
		totalPmax += panel.maximumPower
	})
	return {
		totalPmax: totalPmax.toFixed(2),
	}
}
