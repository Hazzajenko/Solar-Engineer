import {
	ClosedCircuitChain,
	OpenCircuitChain,
	PanelLinkChain,
	PanelLinkModel,
} from '@entities/shared'

export const groupLinkPointsByChain = (links: PanelLinkModel[]) => {
	const linksSeparatedByChain = separatePanelLinkChains(links)
	// const linksSeparatedByChain = getPanelLinkOrderSeparateChains(links)
	console.log('linksSeparatedByChain', linksSeparatedByChain)
	return linksSeparatedByChain.map((chain) => {
		return chain.map((link) => {
			return {
				...link,
				linePoints: link.linePoints.flatMap((point) => [point.x, point.y]),
			}
		})
	})
}

export const separatePanelLinkChains = (panelLinks: PanelLinkModel[]) => {
	const positivePanelIds = new Set(panelLinks.map((pl) => pl.positivePanelId))
	const startOfChains = panelLinks.filter(
		(panelLink) => !positivePanelIds.has(panelLink.negativePanelId),
	)

	const chains: PanelLinkModel[][] = []

	for (let i = 0; i < startOfChains.length; i++) {
		const chain: PanelLinkModel[] = [startOfChains[i]]
		for (let j = i + 1; j < panelLinks.length; j++) {
			const currentPanelLink = chain[chain.length - 1]
			if (panelLinks[j].negativePanelId === currentPanelLink.positivePanelId) {
				chain.push(panelLinks[j])
			}
		}
		chains.push(chain)
	}

	return chains
}

/*export const sortPanelLinksAndMapIndex = <T extends PanelLinkModel[]>(panelLinkChain: T) =>
 panelLinkChain
 .sort(sortPanelLinksCompareFn)
 .map((panelLink, index) => ({ ...panelLink, index } as PanelLinkModelWithIndex))*/
export const sortPanelLinks = <T extends PanelLinkModel[]>(panelLinkChain: T) =>
	panelLinkChain.sort(sortPanelLinksCompareFn)

const sortPanelLinksCompareFn = (a: PanelLinkModel, b: PanelLinkModel) => {
	if (!a || !b) {
		return 0
	}
	return a.positivePanelId === b.negativePanelId ? 1 : -1
}

export const sortOpenCircuitPanelLinks = (openCircuitChain: OpenCircuitChain) =>
	openCircuitChain.sort(sortOpenCircuitPanelLinksCompareFn) as PanelLinkChain

const sortOpenCircuitPanelLinksCompareFn = (a: PanelLinkModel, b: PanelLinkModel) => {
	if (!a || !b) {
		return 0
	}
	return a.positivePanelId === b.negativePanelId ? 1 : -1
}

export const sortClosedCircuitPanelLinks = (closedCircuitChain: ClosedCircuitChain) =>
	closedCircuitChain.sort(sortClosedCircuitPanelLinksCompareFn) as PanelLinkChain

const sortClosedCircuitPanelLinksCompareFn = (a: PanelLinkModel, b: PanelLinkModel) => {
	if (!a || !b) {
		return 0
	}
	return a.positivePanelId === b.negativePanelId ? 1 : -1
}
