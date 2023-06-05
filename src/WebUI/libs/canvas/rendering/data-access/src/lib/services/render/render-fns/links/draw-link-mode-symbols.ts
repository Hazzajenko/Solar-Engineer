import { getEntitySize, PanelModel, PanelSymbol } from '@entities/shared'
import { toRadians } from '@canvas/utils'
import { AngleDegrees } from '@shared/data-access/models'

const lineLength = 5
export const drawLinkModeSymbols = (
	ctx: CanvasRenderingContext2D,
	panel: PanelModel,
	mouseOverSymbol: PanelSymbol | undefined = undefined,
) => {
	const isHovered = panel.id === mouseOverSymbol?.panelId
	const isPositive = isHovered && mouseOverSymbol?.symbol === 'positive'
	const isNegative = isHovered && mouseOverSymbol?.symbol === 'negative'

	ctx.save()
	// draw negative symbol
	const negativeLineLength = isNegative ? lineLength * 1.25 : lineLength
	const { width } = getEntitySize(panel)
	ctx.save()
	ctx.translate(-width / 2, 0)
	ctx.save()
	ctx.rotate(toRadians(45 as AngleDegrees))
	ctx.strokeStyle = 'black'
	ctx.strokeRect(
		-negativeLineLength / 2,
		-negativeLineLength / 2,
		negativeLineLength,
		negativeLineLength,
	)
	// ctx.fillStyle = isNegative ? '#4FC3F7' : 'blue'
	ctx.fillStyle = 'blue'
	// #E57373
	// #4FC3F7
	ctx.fillRect(
		-negativeLineLength / 2,
		-negativeLineLength / 2,
		negativeLineLength,
		negativeLineLength,
	)
	ctx.restore()
	ctx.strokeStyle = 'white'
	ctx.beginPath()
	ctx.moveTo(-lineLength / 2, 0)
	ctx.lineTo(lineLength / 2, 0)
	ctx.stroke()
	ctx.restore()

	// draw positive symbol
	const positiveLineLength = isPositive ? lineLength * 1.25 : lineLength
	ctx.save()
	ctx.translate(width / 2, 0)
	ctx.save()
	ctx.rotate(toRadians(45 as AngleDegrees))
	ctx.strokeStyle = 'black'
	ctx.strokeRect(
		-positiveLineLength / 2,
		-positiveLineLength / 2,
		positiveLineLength,
		positiveLineLength,
	)
	ctx.fillStyle = 'red'
	// ctx.fillStyle = isPositive ? '#E57373' : 'red'
	ctx.fillRect(
		-positiveLineLength / 2,
		-positiveLineLength / 2,
		positiveLineLength,
		positiveLineLength,
	)
	ctx.restore()

	ctx.strokeStyle = 'white'
	ctx.beginPath()
	ctx.moveTo(-lineLength / 2, 0)
	ctx.lineTo(lineLength / 2, 0)
	ctx.moveTo(0, -lineLength / 2)
	ctx.lineTo(0, lineLength / 2)
	ctx.stroke()
	ctx.restore()

	ctx.restore()
}
