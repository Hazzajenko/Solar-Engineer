import { OpenCircuitChainWithIndex, PanelModel } from '@entities/shared'

export const drawLinkModeOrderNumbers = (
	ctx: CanvasRenderingContext2D,
	panel: PanelModel,
	linksInOrder: OpenCircuitChainWithIndex[],
	selectedStringPanel: PanelModel | undefined,
) => {
	if (!linksInOrder.length) {
		return
	}
	const chain = linksInOrder.findIndex((linkChain) =>
		linkChain.openCircuitChains.some(
			(link) => link?.positivePanelId === panel.id || link?.negativePanelId === panel.id,
		),
	)

	if (chain === -1) {
		return
	}

	const chainSorted = linksInOrder[chain]
	let linkIndex = chainSorted.panelIndexMap.get(panel.id) ?? -1
	if (linkIndex === -1) {
		return
	}
	if (selectedStringPanel) {
		const selectedPanelIndex = chainSorted.panelIndexMap.get(selectedStringPanel.id) ?? -1
		if (selectedPanelIndex !== -1) {
			if (linkIndex === selectedPanelIndex) {
				linkIndex = 0
			} else {
				linkIndex -= selectedPanelIndex
			}
		}
	}

	ctx.save()
	ctx.rotate(-panel.angle)
	const fontSize = 10
	ctx.font = `${fontSize}px Consolas, sans-serif`
	const text = `${linkIndex}`
	const metrics = ctx.measureText(text)
	const x = -metrics.width / 2
	const y = fontSize / 4
	ctx.fillStyle = 'black'
	ctx.fillText(text, x, y)
	ctx.restore()
}
