import {
	PanelLinkId,
	PanelLinkModel,
	PanelModel,
	PanelSymbol,
	Polarity,
	StringId,
} from '@entities/shared'
import { newGuid } from '@shared/utils'
import { calculateLinkLinesBetweenTwoPanelCenters } from './link-lines'

export const createPanelLink = (
	stringId: StringId,
	panels: {
		positivePanel: PanelModel
		negativePanel: PanelModel
	},
) => {
	const { positivePanel, negativePanel } = panels
	return {
		id: newGuid() as PanelLinkId,
		stringId,
		positivePanelId: positivePanel.id,
		negativePanelId: negativePanel.id,
		linePoints: calculateLinkLinesBetweenTwoPanelCenters(positivePanel, negativePanel),
	} as PanelLinkModel
}
export const isPolarity = (val: unknown): val is Polarity => {
	return val === 'positive' || val === 'negative'
}

/*
 export const isPanelSymbol = (val: unknown): val is 'positive' | 'negative' => {
 return val === 'positive' || val === 'negative'
 }
 */

export const isPanelSymbol = (val: unknown): val is PanelSymbol => {
	return (
		typeof val === 'object' &&
		val !== null &&
		'panelId' in val &&
		'symbol' in val &&
		isPolarity(val.symbol)
	)
}
