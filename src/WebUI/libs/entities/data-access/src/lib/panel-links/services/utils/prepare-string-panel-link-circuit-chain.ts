import { sortPanelLinks } from '@entities/utils'
import {
	OpenCircuitChain,
	OpenCircuitChainWithIndex,
	PanelId,
	PanelLinkModel,
	StringCircuitChainsWithIndex,
} from '@entities/shared'

export const prepareStringPanelLinkCircuitChain = (panelLinks: PanelLinkModel[]) => {
	const circuitChains = getPanelLinkOrderSeparateChainsWithIndexMap(
		panelLinks,
	) as StringCircuitChainsWithIndex

	const openCircuitChains = circuitChains.openCircuitChainsWithIndexMap
	const closedCircuitChains = circuitChains.closedCircuitChains.map((chain) =>
		sortPanelLinks(chain),
	)
	return {
		openCircuitChains,
		closedCircuitChains,
	}
}

const getPanelLinkOrderSeparateChainsWithIndexMap = (panelLinks: PanelLinkModel[]) => {
	const positivePanelIds = new Set(panelLinks.map((pl) => pl.positivePanelId))
	const startOfChains = panelLinks.filter(
		(panelLink) => !positivePanelIds.has(panelLink.negativePanelId),
	)

	const completeLinkIds: string[] = []

	const setMap = (panelIndexMap: Map<PanelId, number>, panelId: PanelId, index: number) => {
		if (panelIndexMap.has(panelId)) {
			return
		}
		if (panelIndexMap.size === 0 && index !== 0) {
			console.error('panelIndexMap', panelIndexMap)
			throw new Error('panelIndexMap.size === 0 && index !== 0')
		}
		panelIndexMap.set(panelId, index)
	}

	const openCircuitChainsWithIndexMap: OpenCircuitChainWithIndex[] = startOfChains
		.map((panelLink) => {
			const panelLinkChain = [panelLink]
			completeLinkIds.push(panelLink.id)
			let currentPanelLink = panelLink
			let panelLinkChainOrderInProcess = true
			while (panelLinkChainOrderInProcess) {
				const nextPanelLink = panelLinks.find(
					(pl) => pl.negativePanelId === currentPanelLink.positivePanelId,
				)
				if (!nextPanelLink) {
					panelLinkChainOrderInProcess = false
					return panelLinkChain
				}
				panelLinkChain.push(nextPanelLink)
				currentPanelLink = nextPanelLink
			}
			return panelLinkChain
		})
		.map((panelLinkChain) => {
			const openCircuitChains = sortPanelLinks([...panelLinkChain]).map((link, index) => ({
				...link,
				index,
			})) as OpenCircuitChain
			const panelIndexMap = new Map<PanelId, number>()
			openCircuitChains.forEach((link, index) => {
				setMap(panelIndexMap, link.positivePanelId, index)
				setMap(panelIndexMap, link.negativePanelId, index + 1)
			})
			return { openCircuitChains, panelIndexMap } as OpenCircuitChainWithIndex
		})

	const possibleClosedCircuitLinks = panelLinks.filter((pl) => !completeLinkIds.includes(pl.id))

	if (possibleClosedCircuitLinks.length === 0) {
		return {
			openCircuitChainsWithIndexMap,
			closedCircuitChains: [],
		}
	}

	const { closedCircuitChains, unknownCircuitChains } = handleClosedCircuitChains(
		possibleClosedCircuitLinks,
	)

	if (unknownCircuitChains.length > 0) {
		// console.log('unknownCircuitChains', unknownCircuitChains)
	}

	return {
		openCircuitChainsWithIndexMap,
		closedCircuitChains,
	}
}

const handleClosedCircuitChains = (possibleClosedCircuitLinks: PanelLinkModel[]) => {
	const closedCircuitChains: PanelLinkModel[][] = []
	const visitedPanelLinks = new Set<PanelLinkModel['id']>()
	const unknownCircuitChains: PanelLinkModel[][] = []

	const findByNegativePanelIdExcludingVisited = (positivePanelId: string) => {
		return possibleClosedCircuitLinks
			.filter((panelLinks) => !visitedPanelLinks.has(panelLinks.id))
			.find((panelLink) => panelLink.negativePanelId === positivePanelId)
	}

	possibleClosedCircuitLinks.forEach((panelLink) => {
		if (visitedPanelLinks.has(panelLink.id)) {
			return
		}
		visitedPanelLinks.add(panelLink.id)

		const chain: PanelLinkModel[] = [panelLink]
		const startingLinkForChain = panelLink
		let currentPanelLink = panelLink
		let panelLinkChainOrderInProcess = true

		const endProcess = (nextPanelLink: PanelLinkModel) => {
			panelLinkChainOrderInProcess = false
			chain.push(nextPanelLink)
			closedCircuitChains.push(chain)
			return
		}

		while (panelLinkChainOrderInProcess) {
			const nextPanelLink = findByNegativePanelIdExcludingVisited(currentPanelLink.positivePanelId)
			if (!nextPanelLink) {
				panelLinkChainOrderInProcess = false
				unknownCircuitChains.push(chain)
				return
			}
			if (nextPanelLink.positivePanelId === startingLinkForChain.negativePanelId) {
				endProcess(nextPanelLink)
				return
			}
			if (nextPanelLink.id === startingLinkForChain.id) {
				endProcess(nextPanelLink)
				return
			}

			if (visitedPanelLinks.has(nextPanelLink.id)) {
				endProcess(nextPanelLink)
				return
			}

			chain.push(nextPanelLink)
			currentPanelLink = nextPanelLink
		}
	})

	return {
		closedCircuitChains,
		unknownCircuitChains,
	}
}
