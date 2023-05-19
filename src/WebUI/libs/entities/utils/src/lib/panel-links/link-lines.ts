import { CanvasPanel, getEntityCenter } from '@entities/shared'
import { Point } from '@shared/data-access/models'

/**
 * Calculates the points for the link lines between two panels.
 * @param positivePanel The panel with the positive polarity.
 * @param negativePanel The panel with the negative polarity.
 * @returns The points for the link lines between the two panels.
 */
export type LinkLinePoints = [Point, Point]

export const calculateLinkLinesBetweenTwoPanelCenters = (
	positivePanel: CanvasPanel,
	negativePanel: CanvasPanel,
): LinkLinePoints => {
	return [getEntityCenter(positivePanel), getEntityCenter(negativePanel)]
	/*	return [
	 { x: positivePanel.location.x + positivePanel.width / 2, y: positivePanel.location.y + positivePanel.height / 2 },
	 { x: negativePanel.location.x + negativePanel.width / 2, y: negativePanel.location.y + negativePanel.height / 2 },
	 ]*/
}
// getEntityCenter()
export const calculateLinkLinesBetweenTwoPanels = (
	positivePanel: CanvasPanel,
	negativePanel: CanvasPanel,
): LinkLinePoints => {
	return [getPositiveSymbolLocation(positivePanel), getNegativeSymbolLocation(negativePanel)]
}

export const getSymbolLocations = (panel: CanvasPanel) => {
	return [getNegativeSymbolLocation(panel), getPositiveSymbolLocation(panel)]
}

export const getSymbolLocationPoints = (panel: CanvasPanel) => {
	return {
		negative: getNegativeSymbolLocation(panel),
		positive: getPositiveSymbolLocation(panel),
	}
}

export const getPositiveSymbolLocation = (panel: CanvasPanel) => {
	const x = panel.location.x + panel.width
	const y = panel.location.y + panel.height / 2
	return { x, y }
}

export const getNegativeSymbolLocation = (panel: CanvasPanel) => {
	const x = panel.location.x
	const y = panel.location.y + panel.height / 2
	return { x, y }
}
