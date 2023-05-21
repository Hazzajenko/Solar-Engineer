import { CanvasPanel, OpenCircuitChain } from '@entities/shared'

export const drawLinkModeOrderNumbers = (
	ctx: CanvasRenderingContext2D,
	panel: CanvasPanel,
	linksInOrder: OpenCircuitChain[], // linksInOrder: PanelLinkModel[][],
) => {
	if (!linksInOrder.length) {
		return
	}
	const chain = linksInOrder.findIndex((linkChain) =>
		linkChain.some(
			(link) => link?.positivePanelId === panel.id || link?.negativePanelId === panel.id,
		),
	)

	if (chain === -1) {
		return
	}

	const chainSorted = linksInOrder[chain]
	// const chainSorted = getChainSorted(linksInOrder[chain])
	const linkIndex = chainSorted.findIndex((link) => link?.positivePanelId === panel.id)
	const properIndex = linkIndex !== -1 ? linkIndex : chainSorted.length

	ctx.save()
	const fontSize = 10
	ctx.font = `${fontSize}px Consolas, sans-serif`
	const text = `${properIndex + 1}`
	const metrics = ctx.measureText(text)
	const x = -metrics.width / 2
	const y = fontSize / 4
	ctx.fillStyle = 'black'
	ctx.fillText(text, x, y)
	ctx.restore()
}
