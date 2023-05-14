export type PanelLinkModel = {
	id: string
	stringId: string
	negativePanelId: string
	positivePanelId: string
}

export type PanelLinkRequest = {
	direction: PolarityDirection
	stringId: string
	panelId: string
}

export type PolarityDirection = 'positive-to-negative' | 'negative-to-positive'
export type Polarity = 'positive' | 'negative'

export const getStarterPolarityFromDirection = (direction: PolarityDirection): Polarity => {
	switch (direction) {
		case 'positive-to-negative':
			return 'positive'
		case 'negative-to-positive':
			return 'negative'
	}
}

export const getEnderPolarityFromDirection = (direction: PolarityDirection): Polarity => {
	switch (direction) {
		case 'positive-to-negative':
			return 'negative'
		case 'negative-to-positive':
			return 'positive'
	}
}
