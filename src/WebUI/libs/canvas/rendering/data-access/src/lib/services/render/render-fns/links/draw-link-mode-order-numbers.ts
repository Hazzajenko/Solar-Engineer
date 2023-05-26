import { OpenCircuitChain, PanelModel } from '@entities/shared'

export const drawLinkModeOrderNumbers = (
	ctx: CanvasRenderingContext2D,
	panel: PanelModel,
	linksInOrder: OpenCircuitChain[], // linksInOrder: PanelLinkModel[][],
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
	// const chainSorted = getChainSorted(linksInOrder[chain])
	const linkIndex = chainSorted.findIndex((link) => link?.negativePanelId === panel.id)
	const properIndex = linkIndex !== -1 ? linkIndex : chainSorted.length
	let indexToEdit = properIndex

	if (selectedStringPanel) {
		const selectedPanelIndex =
			chainSorted.findIndex((link) => link?.positivePanelId === selectedStringPanel.id) ??
			chainSorted.findIndex((link) => link?.negativePanelId === selectedStringPanel.id)
		if (selectedPanelIndex !== -1) {
			// const selectedPanelIndexProper = selectedPanelIndex + 1
			if (properIndex === selectedPanelIndex) {
				// ctx.fillStyle = 'red'
				indexToEdit = 0
			} else {
				indexToEdit -= selectedPanelIndex
				/*				if (properIndex === selectedPanelIndex + 1) {
				 ctx.fillStyle = 'green'
				 }
				 if (properIndex === selectedPanelIndex - 1) {
				 ctx.fillStyle = 'blue'
				 }*/
			}

			/*		if (properIndex === selectedPanelIndex + 1) {
			 ctx.fillStyle = 'green'
			 }

			 if (properIndex === selectedPanelIndex - 1) {
			 ctx.fillStyle = 'blue'
			 }*/

			/*	if (properIndex === selectedPanelIndex + 2) {
			 ctx.fillStyle = 'yellow'
			 }*/
		}
	}

	ctx.save()
	ctx.rotate(-panel.angle)
	const fontSize = 10
	ctx.font = `${fontSize}px Consolas, sans-serif`
	const text = `${indexToEdit + 1}`
	const metrics = ctx.measureText(text)
	const x = -metrics.width / 2
	const y = fontSize / 4
	ctx.fillStyle = 'black'
	ctx.fillText(text, x, y)
	ctx.restore()
}
