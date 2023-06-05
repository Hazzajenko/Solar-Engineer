import {
	EntityBase,
	OpenCircuitChainWithIndex,
	PanelLinkFromMenu,
	PanelLinkId,
	PanelLinkModel,
	PanelModel,
	PanelSymbol,
	PanelWithSymbol,
} from '@entities/shared'
import {
	CurvedNumberLine,
	DrawOptions,
	LineToLineNumberLine,
	QuadraticNumberLine,
} from '@canvas/shared'
import {
	drawBezierLineNumbersWithOptions,
	drawQuadraticLineNumbersWithOptions,
	drawStraightLineNumbersWithOptions,
	getAngleInRadiansBetweenTwoPoints,
	getQuadraticAngleAtPointUsingNumberLine,
} from '@canvas/utils'
import { Point, TransformedPoint } from '@shared/data-access/models'
import { getPanelWithSymbolLocationBasedOnPolarity } from '@entities/utils'

const offset = 0
let image: HTMLImageElement | undefined
export const drawLinkModePathLinesCurvedAlreadyMappedV6 = (
	ctx: CanvasRenderingContext2D,
	customEntities: EntityBase[] | undefined,
	circuitLinkLineTuples: [PanelLinkId, CurvedNumberLine][][],
	panelLinkUnderMouse: PanelLinkModel | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinkFromMenu | undefined,
	selectedPanelLinkId: PanelLinkId | undefined,
	finalDrawLineSymbol: PanelSymbol | undefined,
	singleSelectedPanel: PanelModel | undefined,
	panelLinkForSelectedPanel:
		| {
				negativeToLink: PanelLinkModel | undefined
				positiveToLink: PanelLinkModel | undefined
		  }
		| undefined,
	openCircuitChains: OpenCircuitChainWithIndex[],
) => {
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

	let selectedPanelChainIndex = -1
	let selectedPanelPathIndex = -1
	if (singleSelectedPanel) {
		selectedPanelChainIndex = openCircuitChains.findIndex((chain) =>
			chain.panelIndexMap.has(singleSelectedPanel?.id),
		)
		selectedPanelPathIndex =
			selectedPanelChainIndex !== -1
				? openCircuitChains[selectedPanelChainIndex].panelIndexMap.get(singleSelectedPanel?.id) ??
				  -1
				: -1
	}

	for (
		let linkCircuitIndex = 0;
		linkCircuitIndex < circuitLinkLineTuples.length;
		linkCircuitIndex += 1
	) {
		const linkLineTuple = circuitLinkLineTuples[linkCircuitIndex]

		const selectedPanelInThisChain = selectedPanelChainIndex === linkCircuitIndex
		for (let linkLineIndex = 0; linkLineIndex < linkLineTuple.length; linkLineIndex += 1) {
			const id = linkLineTuple[linkLineIndex][0]
			const lines = linkLineTuple[linkLineIndex][1]

			const selectedPanelIndexConfig =
				selectedPanelInThisChain && selectedPanelPathIndex !== -1
					? selectedPanelPathIndex
					: undefined

			const options: Partial<DrawOptions> | undefined = getDrawOptionsBasedOnInputs(
				id,
				panelLinkUnderMouse,
				hoveringOverPanelLinkInLinkMenu,
				selectedPanelLinkId,
				finalDrawLineSymbol,
				linkLineIndex,
				linkLineTuple.length,
				selectedPanelIndexConfig,
			)

			ctx.save()
			drawCurvedNumberLinesWithOptions(ctx, lines, options)
			ctx.restore()
		}
	}
	ctx.restore()
}

/*const animateLineDash = (ctx: CanvasRenderingContext2D) => {
 const animate = () => {
 offset += 0.5
 if (offset > 16) {
 offset = 0
 }
 ctx.setLineDash([4, 2])
 requestAnimationFrame(animate)
 }
 requestAnimationFrame(animate)
 }*/

const getDrawOptionsBasedOnInputs = (
	panelLinkId: PanelLinkId,
	panelLinkUnderMouse: PanelLinkModel | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinkFromMenu | undefined,
	selectedPanelLinkId: PanelLinkId | undefined,
	finalDrawLineSymbol: PanelSymbol | undefined,
	index: number,
	linkLineTupleLength: number,
	selectedPanelIndexConfig: number | undefined,
): Partial<DrawOptions> | undefined => {
	if (hoveringOverPanelLinkInLinkMenu?.panelLinkId === panelLinkId) {
		return PanelLinkHoverDefaultDrawOptions
	}
	if (panelLinkUnderMouse?.id === panelLinkId) {
		return PanelLinkHoverDefaultDrawOptions
	}
	if (selectedPanelLinkId === panelLinkId) {
		return PanelLinkHoverDefaultDrawOptions
	}
	if (index === linkLineTupleLength - 1 && finalDrawLineSymbol) {
		if (finalDrawLineSymbol.symbol === 'positive') {
			return {
				strokeStyle: 'red',
				lineWidth: 2,
			}
		}
		return {
			strokeStyle: 'blue',
			lineWidth: 2,
		}
	}
	if (selectedPanelIndexConfig) {
		if (index === linkLineTupleLength - 1) {
			return {
				strokeStyle: 'blue',
				lineWidth: 2,
			}
		}
		if (selectedPanelIndexConfig > index) {
			return {
				strokeStyle: 'red',
				lineWidth: 2,
			}
		}
		return {
			strokeStyle: 'blue',
			lineWidth: 2,
		}
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

export const checkIfManyPanelIdsAreWithPanelLink = (
	panelIds: string[],
	panelLinks: PanelLinkModel[],
) => {
	return panelIds.some((id) => checkIfPanelIdIsWithPanelLink(id, panelLinks))
}

export const checkIfPanelIdIsWithPanelLink = (panelId: string, panelLinks: PanelLinkModel[]) => {
	return panelLinks.some((l) => l.positivePanelId === panelId || l.negativePanelId === panelId)
}

export const checkIfPanelIsWithPanelLink = (
	panelId: PanelModel['id'],
	panelLinks: PanelLinkModel[],
) => {
	return panelLinks.some((l) => l.positivePanelId === panelId || l.negativePanelId === panelId)
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

export const drawToFromArrowhead = (
	ctx: CanvasRenderingContext2D,
	from: Point,
	to: Point,
	radius: number,
) => {
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

export const drawArrowheadSvg = (ctx: CanvasRenderingContext2D, line: QuadraticNumberLine) => {
	if (!image) return
	const from = { x: line[2], y: line[3] }
	// const from = { x: line[0], y: line[1] }
	const to = { x: line[4], y: line[5] }
	const angle = getAngleInRadiansBetweenTwoPoints(from, to)
	// const angle = getQuadraticAngleAtPointUsingNumberLine(line, 1)
	const x = line[4]
	const y = line[5]
	ctx.save()
	ctx.beginPath()
	ctx.translate(x, y)
	ctx.rotate(angle)
	ctx.drawImage(image, -10, -10, 20, 20)
	ctx.restore()
}

export const drawDraggingSymbolLinkLine = (
	ctx: CanvasRenderingContext2D,
	panelWithSymbol: PanelWithSymbol,
	mousePoint: TransformedPoint,
) => {
	const startPoint = getPanelWithSymbolLocationBasedOnPolarity(panelWithSymbol)
	const straightLine: LineToLineNumberLine = [
		startPoint.x,
		startPoint.y,
		mousePoint.x,
		mousePoint.y,
	]
	drawStraightLineNumbersWithOptions(ctx, straightLine)
	drawToFromArrowhead(ctx, startPoint, mousePoint, 2)
}
