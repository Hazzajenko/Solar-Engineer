import { sortPanelLinks } from '@entities/utils'
import { ClosedCircuitChain, OpenCircuitChain, PanelLinkModel } from '@entities/shared'

export const prepareStringPanelLinkCircuitChain = (panelLinks: PanelLinkModel[]) => {
	const circuitChains = getPanelLinkOrderSeparateChainsV2(panelLinks) as {
		openCircuitChains: OpenCircuitChain[]
		closedCircuitChains: ClosedCircuitChain[]
	}

	const openCircuitChains = circuitChains.openCircuitChains.map((chain) => sortPanelLinks(chain))
	// console.log('openCircuitChains', openCircuitChains)
	// const openCircuitChains = circuitChains.openCircuitChains.map((chain) => sortPanelLinks(chain))
	const closedCircuitChains = circuitChains.closedCircuitChains.map((chain) =>
		sortPanelLinks(chain),
	)
	return {
		openCircuitChains,
		closedCircuitChains,
	}
	/*	const groupedByLinkChain = separatePanelLinkChains(panelLinks)
	 const groupedByLinkChainSorted = groupedByLinkChain.map((chain) =>
	 sortOpenCircuitPanelLinks(chain as OpenCircuitChain),
	 )
	 const flatNumberArray = groupedByLinkChainSorted.map((chain) =>
	 reduceLinkPointsToNumberArrayOptimised(chain),
	 )
	 return flatNumberArray.map((chain) => createCurvedLinkPathLines(chain))*/
}

const getPanelLinkOrderSeparateChainsV2 = (panelLinks: PanelLinkModel[]) => {
	const positivePanelIds = new Set(panelLinks.map((pl) => pl.positivePanelId))
	const startOfChains = panelLinks.filter(
		(panelLink) => !positivePanelIds.has(panelLink.negativePanelId),
	)

	const completeLinkIds: string[] = []

	const openCircuitChains = startOfChains.map((panelLink) => {
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

	const possibleClosedCircuitLinks = panelLinks.filter((pl) => !completeLinkIds.includes(pl.id))

	if (possibleClosedCircuitLinks.length === 0) {
		return {
			openCircuitChains,
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
		openCircuitChains,
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
			// console.log('closedCircuitChains', closedCircuitChains)
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
