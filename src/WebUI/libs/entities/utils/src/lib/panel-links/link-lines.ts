import { getEntityCenter, PanelModel, PanelWithSymbol, Polarity } from '@entities/shared'
import { Point } from '@shared/data-access/models'

/**
 * Calculates the points for the link lines between two panels.
 * @param positivePanel The panel with the positive polarity.
 * @param negativePanel The panel with the negative polarity.
 * @returns The points for the link lines between the two panels.
 */
export type LinkLinePoints = [Point, Point]

export const calculateLinkLinesBetweenTwoPanelCenters = (
	positivePanel: PanelModel,
	negativePanel: PanelModel,
): LinkLinePoints => {
	return [getEntityCenter(positivePanel), getEntityCenter(negativePanel)]
	/*	return [
	 { x: positivePanel.location.x + positivePanel.width / 2, y: positivePanel.location.y + positivePanel.height / 2 },
	 { x: negativePanel.location.x + negativePanel.width / 2, y: negativePanel.location.y + negativePanel.height / 2 },
	 ]*/
}
// getEntityCenter()
export const calculateLinkLinesBetweenTwoPanels = (
	positivePanel: PanelModel,
	negativePanel: PanelModel,
): LinkLinePoints => {
	return [getPositiveSymbolLocation(positivePanel), getNegativeSymbolLocation(negativePanel)]
}

export const getSymbolLocations = (panel: PanelModel) => {
	return [getNegativeSymbolLocation(panel), getPositiveSymbolLocation(panel)]
}

export const getSymbolLocationPoints = (panel: PanelModel) => {
	return {
		negative: getNegativeSymbolLocation(panel),
		positive: getPositiveSymbolLocation(panel),
	}
}

export const getPositiveSymbolLocation = (panel: PanelModel) => {
	const x = panel.location.x + panel.width
	const y = panel.location.y + panel.height / 2
	return { x, y }
}

export const getNegativeSymbolLocation = (panel: PanelModel) => {
	const x = panel.location.x
	const y = panel.location.y + panel.height / 2
	return { x, y }
}

export const getPanelWithSymbolLocationBasedOnPolarity = (panel: PanelWithSymbol) => {
	return panel.symbol === 'positive'
		? getPositiveSymbolLocation(panel)
		: getNegativeSymbolLocation(panel)
}

export const getPanelLocationBasedOnPolarity = (panel: PanelModel, polarity: Polarity) => {
	return polarity === 'positive'
		? getPositiveSymbolLocation(panel)
		: getNegativeSymbolLocation(panel)
}

export const getPanelLocationBasedOnOppositePolarity = (panel: PanelModel, polarity: Polarity) => {
	return getOppositePolarity(polarity) === 'positive'
		? getPositiveSymbolLocation(panel)
		: getNegativeSymbolLocation(panel)
}

export const getOppositePolarity = (polarity: Polarity) => {
	return polarity === 'positive' ? 'negative' : 'positive'
}
