import { sortPanelLinks } from '@entities/utils'
import {
	OpenCircuitChain,
	OpenCircuitChainWithIndex,
	PanelId,
	PanelLinkModel,
	StringCircuitChainsWithIndex,
} from '@entities/shared'

export const prepareStringPanelLinkCircuitChain = (panelLinks: PanelLinkModel[]) => {
	/*	const circuitChains = getPanelLinkOrderSeparateChains(panelLinks) as {
	 openCircuitChains: OpenCircuitChain[]
	 closedCircuitChains: ClosedCircuitChain[]
	 }*/

	const circuitChains = getPanelLinkOrderSeparateChainsWithIndexMap(
		panelLinks,
	) as StringCircuitChainsWithIndex

	const openCircuitChains = circuitChains.openCircuitChainsWithIndexMap
	// const openCircuitChains = circuitChains.openCircuitChains
	// const openCircuitChainIndexMap = new Map<string, number>()
	// const openCircuitChains = circuitChains.openCircuitChains.map((chain) => sortPanelLinks(chain))
	const closedCircuitChains = circuitChains.closedCircuitChains.map((chain) =>
		sortPanelLinks(chain),
	)
	return {
		openCircuitChains,
		closedCircuitChains,
	}
}

const getPanelLinkOrderSeparateChains = (panelLinks: PanelLinkModel[]) => {
	const positivePanelIds = new Set(panelLinks.map((pl) => pl.positivePanelId))
	const startOfChains = panelLinks.filter(
		(panelLink) => !positivePanelIds.has(panelLink.negativePanelId),
	)

	const completeLinkIds: string[] = []

	const openCircuitChains = startOfChains
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
		.map((chain) => {
			sortPanelLinks(chain)
			return chain.map((link, index) => ({ ...link, index }))
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

const getPanelLinkOrderSeparateChainsWithIndexMap = (panelLinks: PanelLinkModel[]) => {
	const positivePanelIds = new Set(panelLinks.map((pl) => pl.positivePanelId))
	const startOfChains = panelLinks.filter(
		(panelLink) => !positivePanelIds.has(panelLink.negativePanelId),
	)

	const completeLinkIds: string[] = []

	const openCircuitChainsWithIndexMap: OpenCircuitChainWithIndex[] = startOfChains
		.map((panelLink) => {
			const panelLinkChain = [panelLink]
			const panelIndexMap = new Map<PanelId, number>()
			panelIndexMap.set(panelLink.positivePanelId, 0)
			panelIndexMap.set(panelLink.negativePanelId, 1)
			completeLinkIds.push(panelLink.id)
			let currentPanelLink = panelLink
			let panelLinkChainOrderInProcess = true
			while (panelLinkChainOrderInProcess) {
				const nextPanelLink = panelLinks.find(
					(pl) => pl.negativePanelId === currentPanelLink.positivePanelId,
				)
				if (!nextPanelLink) {
					panelLinkChainOrderInProcess = false
					return { panelLinkChain, panelIndexMap }
				}
				panelLinkChain.push(nextPanelLink)
				panelIndexMap.set(nextPanelLink.negativePanelId, panelLinkChain.length)
				currentPanelLink = nextPanelLink
			}
			return { panelLinkChain, panelIndexMap }
		})
		.map(({ panelLinkChain, panelIndexMap }) => {
			sortPanelLinks(panelLinkChain)
			const openCircuitChains = panelLinkChain.map((link, index) => ({
				...link,
				index,
			})) as OpenCircuitChain
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

/*export const reorderPanelLinkChainsBasedOnSelectedPanel = (
 openCircuitChains: OpenCircuitChain[],
 selectedPanel: PanelModel,
 ) => {
 /!*	const positivePanelIds = new Set(panelLinks.map((pl) => pl.positivePanelId))
 const startOfChains = panelLinks.filter(
 (panelLink) => !positivePanelIds.has(panelLink.negativePanelId),
 )

 const completeLinkIds: string[] = []*!/

 let indexOfPanel = openCircuitChains.findIndex((chain) => {
 return chain.some((panelLink) => panelLink.positivePanelId === selectedPanel.id)
 })

 if (indexOfPanel === -1) {
 indexOfPanel = openCircuitChains.findIndex((chain) => {
 return chain.some((panelLink) => panelLink.negativePanelId === selectedPanel.id)
 })
 }

 if (indexOfPanel === -1) {
 return openCircuitChains
 }

 const reorderedChains = openCircuitChains
 .slice(indexOfPanel)
 .concat(openCircuitChains.slice(0, indexOfPanel))

 /!*	const openCircuitChains = startOfChains.map((panelLink) => {
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
 })*!/

 /!*	const possibleClosedCircuitLinks = panelLinks.filter((pl) => !completeLinkIds.includes(pl.id))

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
 }*!/
 }*/
