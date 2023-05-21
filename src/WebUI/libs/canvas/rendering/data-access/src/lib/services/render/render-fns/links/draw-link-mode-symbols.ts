import { CanvasPanel } from '@entities/shared'
import { toRadians } from '@canvas/utils'
import { AngleDegrees } from '@shared/data-access/models'

const lineLength = 5
export const drawLinkModeSymbols = (ctx: CanvasRenderingContext2D, panel: CanvasPanel) => {
	ctx.save()
	// draw negative symbol
	ctx.save()
	ctx.translate(-panel.width / 2, 0)
	ctx.save()
	ctx.rotate(toRadians(45 as AngleDegrees))
	ctx.strokeStyle = 'black'
	ctx.strokeRect(-lineLength / 2, -lineLength / 2, lineLength, lineLength)
	ctx.fillStyle = 'blue'
	ctx.fillRect(-lineLength / 2, -lineLength / 2, lineLength, lineLength)
	ctx.restore()

	ctx.strokeStyle = 'white'
	ctx.beginPath()
	ctx.moveTo(-lineLength / 2, 0)
	ctx.lineTo(lineLength / 2, 0)
	ctx.stroke()
	ctx.restore()

	// draw positive symbol
	ctx.save()
	ctx.translate(panel.width / 2, 0)
	ctx.save()
	ctx.rotate(toRadians(45 as AngleDegrees))
	ctx.strokeStyle = 'black'
	ctx.strokeRect(-lineLength / 2, -lineLength / 2, lineLength, lineLength)
	ctx.fillStyle = 'red'
	ctx.fillRect(-lineLength / 2, -lineLength / 2, lineLength, lineLength)
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
