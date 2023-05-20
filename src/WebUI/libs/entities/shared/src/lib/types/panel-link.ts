import { Point } from '@shared/data-access/models'

export type PanelLinkModel = {
	id: string
	stringId: string
	negativePanelId: string
	positivePanelId: string
	linePoints: Point[]
}

export type PanelLinkChain = PanelLinkModel[]

export type StringCircuitChains = {
	openCircuitChains: OpenCircuitChain[]
	closedCircuitChains: ClosedCircuitChain[]
}

export type OpenOrClosedCircuitChain = OpenCircuitChain | ClosedCircuitChain

export type OpenCircuitChain = PanelLinkChain & {
	__type: 'OpenCircuitChain'
}

export type OpenCircuitPanelLink = PanelLinkModel & {
	__type: 'OpenCircuitPanelLink'
}

export type ClosedCircuitChain = PanelLinkChain & {
	__type: 'ClosedCircuitChain'
}

export type ClosedCircuitPanelLink = PanelLinkModel & {
	__type: 'ClosedCircuitPanelLink'
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
