import { OpenCircuitChain, PanelModel } from '@entities/shared'

export const drawLinkModeOrderNumbers = (
	ctx: CanvasRenderingContext2D,
	panel: PanelModel,
	linksInOrder: OpenCircuitChain[],
	selectedStringPanel: PanelModel | undefined,
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
	let linkIndex = chainSorted.findIndex((link) => link?.positivePanelId === panel.id)
	if (linkIndex === -1) {
		const maybeLastIndex = chainSorted.findIndex((link) => link?.negativePanelId === panel.id)
		if (maybeLastIndex !== -1) {
			if (maybeLastIndex === chainSorted.length - 1) {
				linkIndex = chainSorted.length
			} else {
				linkIndex = maybeLastIndex
			}
		}
	}
	if (linkIndex === -1) {
		return
	}
	if (selectedStringPanel) {
		let selectedPanelIndex = -1
		selectedPanelIndex = chainSorted.findIndex(
			(link) => link?.positivePanelId === selectedStringPanel.id,
		)
		if (chainSorted[chainSorted.length - 1].negativePanelId === selectedStringPanel.id) {
			selectedPanelIndex = chainSorted.length
		}
		if (selectedPanelIndex === -1) {
			const maybeLastIndex = chainSorted.findIndex((link) => link?.negativePanelId === panel.id)
			if (maybeLastIndex !== -1) {
				if (maybeLastIndex === chainSorted.length - 1) {
					selectedPanelIndex = chainSorted.length
				} else {
					selectedPanelIndex = maybeLastIndex
				}
			}
		}

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
	// const text = `${indexToEdit + 1}`
	const metrics = ctx.measureText(text)
	const x = -metrics.width / 2
	const y = fontSize / 4
	ctx.fillStyle = 'black'
	ctx.fillText(text, x, y)
	ctx.restore()
}
