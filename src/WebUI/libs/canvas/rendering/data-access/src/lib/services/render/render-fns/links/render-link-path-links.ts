import { CanvasEntity, PanelLinkFromMenu, PanelLinkId, PanelLinkModel } from '@entities/shared'
import { CurvedNumberLine, DrawOptions, QuadraticNumberLine } from '@canvas/shared'
import {
	drawBezierLineNumbersWithOptions,
	drawQuadraticLineNumbersWithOptions,
	drawStraightLineNumbersWithOptions,
	getQuadraticAngleAtPointUsingNumberLine,
} from '@canvas/utils'

let offset = 0
export const drawLinkModePathLinesCurvedAlreadyMappedV6 = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	circuitLinkLineTuples: [PanelLinkId, CurvedNumberLine][][],
	selectedPanelLinkId: PanelLinkId | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinkFromMenu | undefined,
	panelLinkUnderMouse: PanelLinkModel | undefined,
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const ignore = selectedPanelLinkId || hoveringOverPanelLinkInLinkMenu

	if (!circuitLinkLineTuples.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1
	ctx.lineCap = 'round'
	ctx.lineJoin = 'round'
	ctx.setLineDash([4, 2])
	ctx.lineDashOffset = -offset

	// animateLineDash(ctx)

	for (let i = 0; i < circuitLinkLineTuples.length; i += 1) {
		const linkLineTuple = circuitLinkLineTuples[i]
		for (let j = 0; j < linkLineTuple.length; j += 1) {
			const id = linkLineTuple[j][0]
			const lines = linkLineTuple[j][1]
			const options: Partial<DrawOptions> | undefined = getDrawOptionsBasedOnInputs(
				id,
				panelLinkUnderMouse,
				hoveringOverPanelLinkInLinkMenu,
				selectedPanelLinkId,
			)

			ctx.save()
			drawCurvedNumberLinesWithOptions(ctx, lines, options)
			ctx.restore()
			if (j === linkLineTuple.length - 1) {
				ctx.save()
				drawArrowheadV5(ctx, lines as QuadraticNumberLine, 5)
				// drawArrowhead(ctx, lines as QuadraticNumberLine, 5)
				// const from = { x: lines[0], y: lines[1] }
				// const to = { x: lines[lines.length - 2], y: lines[lines.length - 1] }
				// drawArrowheadV2(ctx, lines as QuadraticNumberLine)
				// drawArrowhead(ctx, from, to, 10)
				// ctx.fillStyle = 'white'

				/*	ctx.font = '12px serif'
				 ctx.fillText(
				 `${lines[0].x},${lines[0].y}`,
				 lines[0].x + 10,
				 lines[0].y + 10,
				 )*/
				ctx.restore()
			}
			/*		if (customEntities) {
			 const entity = customEntities.find((e) => e.id === id)
			 if (entity) {
			 ctx.save()
			 ctx.fillStyle = 'white'
			 ctx.font = '12px serif'
			 ctx.fillText(
			 entity.name,
			 lines[0].x + 10,
			 lines[0].y + 10,
			 )
			 ctx.restore()
			 }
			 }*/
		}
	}
	ctx.restore()
}

const animateLineDash = (ctx: CanvasRenderingContext2D) => {
	const animate = () => {
		offset += 0.5
		if (offset > 16) {
			offset = 0
		}
		ctx.setLineDash([4, 2])
		requestAnimationFrame(animate)
	}
	requestAnimationFrame(animate)
}

const getDrawOptionsBasedOnInputs = (
	panelLinkId: PanelLinkId,
	panelLinkUnderMouse: PanelLinkModel | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinkFromMenu | undefined,
	selectedPanelLinkId: PanelLinkId | undefined,
): Partial<DrawOptions> | undefined => {
	if (hoveringOverPanelLinkInLinkMenu?.panelLinkId === panelLinkId) {
		return PanelLinkHoverDefaultDrawOptions
	}
	if (panelLinkUnderMouse?.id === panelLinkId) {
		return PanelLinkHoverDefaultDrawOptions
	}
	return
}

const PanelLinkHoverDefaultDrawOptions: Partial<DrawOptions> = {
	strokeStyle: 'red',
	lineWidth: 2,
}

const drawCurvedNumberLinesWithOptions = (
	ctx: CanvasRenderingContext2D,
	line: CurvedNumberLine,
	options?: Partial<DrawOptions>,
) => {
	switch (line.length) {
		case 4:
			drawStraightLineNumbersWithOptions(ctx, line, options)
			break
		case 6:
			drawQuadraticLineNumbersWithOptions(ctx, line, options)
			break
		case 8:
			drawBezierLineNumbersWithOptions(ctx, line, options)
			break
	}
}

export const drawArrowheadV2 = (
	ctx: CanvasRenderingContext2D, // point: Point,
	line: QuadraticNumberLine, // radius: number,
) => {
	// const bezzy = new Bezier(line[0], line[1], line[2], line[3], line[4], line[5])
	//
	// const tangent = bezzy.derivative(1)

	// const angle = getAngleInRadiansBetweenTwoPoints(tangent, tupleToCoors([line[4], line[5]]))
	const angle = getQuadraticAngleAtPointUsingNumberLine(line, 1)
	drawArrowheadV3(ctx, line[4], line[5], angle)
}

const drawArrowheadV3 = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
	ctx.save()
	ctx.beginPath()
	ctx.translate(x, y)
	ctx.rotate(angle)
	ctx.moveTo(0, 0)
	ctx.lineTo(10, 20)
	ctx.lineTo(-10, 20)
	ctx.closePath()
	ctx.fill()
	ctx.restore()
}

export const drawArrowhead = (
	ctx: CanvasRenderingContext2D, // from: Point,
	line: QuadraticNumberLine, // to: Point,
	radius: number,
) => {
	const from = { x: line[0], y: line[1] }
	const to = { x: line[4], y: line[5] }

	const x_center = to.x
	const y_center = to.y

	let angle
	let x
	let y

	ctx.beginPath()

	angle = Math.atan2(to.y - from.y, to.x - from.x)
	x = radius * Math.cos(angle) + x_center
	y = radius * Math.sin(angle) + y_center

	ctx.moveTo(x, y)

	angle += (1.0 / 3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center
	y = radius * Math.sin(angle) + y_center

	ctx.lineTo(x, y)

	angle += (1.0 / 3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center
	y = radius * Math.sin(angle) + y_center

	ctx.lineTo(x, y)

	ctx.closePath()

	ctx.fill()
}

export const drawArrowheadV5 = (
	ctx: CanvasRenderingContext2D, // from: Point,
	line: QuadraticNumberLine, // to: Point,
	radius: number,
) => {
	const from = { x: line[0], y: line[1] }
	const to = { x: line[4], y: line[5] }

	const x_center = to.x
	const y_center = to.y

	// const angle
	// const x
	// const y

	ctx.beginPath()

	const angle = Math.atan2(to.y - from.y, to.x - from.x)
	const x = radius * Math.cos(angle) + x_center
	const y = radius * Math.sin(angle) + y_center
	/*	x = radius * Math.cos(angle) + x_center
	 y = radius * Math.sin(angle) + y_center

	 ctx.moveTo(x, y)

	 angle += (1.0 / 3.0) * (2 * Math.PI)
	 x = radius * Math.cos(angle) + x_center
	 y = radius * Math.sin(angle) + y_center

	 ctx.lineTo(x, y)

	 angle += (1.0 / 3.0) * (2 * Math.PI)
	 x = radius * Math.cos(angle) + x_center
	 y = radius * Math.sin(angle) + y_center*/

	/*	ctx.lineTo(x, y)

	 ctx.closePath()

	 ctx.fill()*/
	ctx.save()
	ctx.beginPath()
	ctx.translate(x, y)
	ctx.rotate(angle)
	ctx.moveTo(0, 0)
	ctx.lineTo(10, 20)
	ctx.lineTo(-10, 20)
	ctx.closePath()
	ctx.fill()
	ctx.restore()
}
