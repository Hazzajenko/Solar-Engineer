import { PanelLinkModel } from '@entities/shared'

export const getPanelLinkOrderSeparateChains = (panelLinks: PanelLinkModel[]) => {
	const positivePanelIds = new Set(panelLinks.map((pl) => pl.positivePanelId))
	const startOfChains = panelLinks.filter(
		(panelLink) => !positivePanelIds.has(panelLink.negativePanelId),
	)

	return startOfChains.map((panelLink) => {
		const panelLinkChain = [panelLink]
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
}
