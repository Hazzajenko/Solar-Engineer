import { PanelSymbol, Polarity } from '@entities/shared'

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
