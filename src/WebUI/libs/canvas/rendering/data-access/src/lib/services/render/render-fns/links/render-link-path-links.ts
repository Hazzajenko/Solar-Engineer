import { CanvasEntity, ClosedCircuitChain, OpenCircuitChain, PanelLinkId, PanelLinkModel } from '@entities/shared'
import { PanelLinksStore } from '@entities/data-access'
import { mapStringLinkChainToDoubleNumberArray, reduceLinkPointsToNumberArray, reduceLinkPointsToNumberArrayOptimised, separatePanelLinkChains, sortOpenCircuitPanelLinks } from '@entities/utils'
import { BezierNumberLine, CurvedNumberLine, LineToLineNumberLine, QuadraticNumberLine } from '@canvas/shared'
import { drawBezierLineNumbers, drawQuadraticLineNumbers, drawStraightLineNumbers } from '@canvas/utils'

// type UpdateLinkPath = (linkId: string, path: string) => void

export const drawLinkModePathLinesCurved = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	linksInOrder: PanelLinkModel[],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const ignore = selectedPanelLinkId || hoveringOverPanelLinkInLinkMenu

	// const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!linksInOrder.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	const groupedByLinkChain = separatePanelLinkChains(linksInOrder)
	const groupedByLinkChainSorted = groupedByLinkChain.map((chain) =>
		sortOpenCircuitPanelLinks(chain as OpenCircuitChain),
	)
	const groupedByLinkChainNumberArray = groupedByLinkChainSorted.map((chain) =>
		reduceLinkPointsToNumberArray(chain),
	)

	groupedByLinkChainNumberArray.forEach((linkChain) => {
		drawLinkChainCurvedPath(ctx, linkChain)
	})
}

export const drawLinkModePathLinesCurvedAlreadyMapped = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	linksInOrder: PanelLinkModel[][],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const ignore = selectedPanelLinkId || hoveringOverPanelLinkInLinkMenu

	// const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!linksInOrder.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	const groupedByLinkChainNumberArray = linksInOrder.map((chain) =>
		reduceLinkPointsToNumberArrayOptimised(chain),
	)

	groupedByLinkChainNumberArray.forEach((linkChain) => {
		drawLinkChainCurvedPath(ctx, linkChain)
	})
}

export const drawLinkModePathLinesCurvedAlreadyMappedV2 = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	openCircuitChains: OpenCircuitChain[],
	closedCircuitChains: ClosedCircuitChain[],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const ignore = selectedPanelLinkId || hoveringOverPanelLinkInLinkMenu

	// const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!openCircuitChains.length && !closedCircuitChains.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	const openCircuitChainsFlat = openCircuitChains.map((chain) =>
		reduceLinkPointsToNumberArrayOptimised(chain),
	)

	openCircuitChainsFlat.forEach((linkChain) => {
		drawLinkChainCurvedPath(ctx, linkChain)
	})

	const closedCircuitChainsFlat = closedCircuitChains.map((chain) =>
		reduceLinkPointsToNumberArrayOptimised(chain),
	)

	// console.log('closedCircuitChainsFlat', closedCircuitChainsFlat)

	closedCircuitChainsFlat.forEach((linkChain) => {
		drawLinkChainCurvedPath(ctx, linkChain)
	})

	/*	const groupedByLinkChainNumberArray = openCircuitChains.map((chain) =>
	 reduceLinkPointsToNumberArrayOptimised(chain),
	 )*/
}

export const drawLinkModePathLinesCurvedAlreadyMappedV3 = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	circuitCurvedLines: CurvedNumberLine[][],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const ignore = selectedPanelLinkId || hoveringOverPanelLinkInLinkMenu

	// const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!circuitCurvedLines.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	circuitCurvedLines.forEach((curvedLines) => {
		drawCurvedNumberLines(ctx, curvedLines)
	})
}

export const drawLinkModePathLinesCurvedAlreadyMappedV4 = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	circuitCurvedLines: [PanelLinkId, CurvedNumberLine[]][][],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const ignore = selectedPanelLinkId || hoveringOverPanelLinkInLinkMenu

	// const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!circuitCurvedLines.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	for (let i = 0; i < circuitCurvedLines.length; i += 1) {
		const linesByLinkIdTuple = circuitCurvedLines[i]
		for (let j = 0; j < linesByLinkIdTuple.length; j += 1) {
			const id = linesByLinkIdTuple[j][0]
			const lines = linesByLinkIdTuple[j][1]
			drawCurvedNumberLines(ctx, lines)
			console.log('drawCurvedNumberLines', id, lines)
		}
		/*		const id = linesByLinkIdTuple[0][0]
		 drawCurvedNumberLines(ctx, linesByLinkIdTuple[0][1])
		 drawCurvedNumberLines(ctx, linesByLinkIdTuple[1])*/
	}

	/*	console.log('circuitCurvedLines', circuitCurvedLines)
	 circuitCurvedLines.forEach((curvedLines) => {
	 // const id = curvedLines[0][0]
	 drawCurvedNumberLines(ctx, curvedLines[0][1])
	 // drawCurvedNumberLines(ctx, curvedLines[1])
	 })*/
}

export const drawLinkModePathLinesCurvedAlreadyMappedV5 = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	circuitCurvedLines: CurvedNumberLine[][],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const ignore = selectedPanelLinkId || hoveringOverPanelLinkInLinkMenu

	// const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!circuitCurvedLines.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1
	console.log('circuitCurvedLines', circuitCurvedLines)
	for (let i = 0; i < circuitCurvedLines.length; i += 1) {
		const lines = circuitCurvedLines[i]
		drawCurvedNumberLines(ctx, lines)
	}
}

export const drawLinkModePathLinesCurvedAlreadyMappedV6 = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	circuitLinkLineTuples: [PanelLinkId, CurvedNumberLine][][],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const ignore = selectedPanelLinkId || hoveringOverPanelLinkInLinkMenu

	// const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!circuitLinkLineTuples.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	const stringPanelLinkLines = mapStringLinkChainToDoubleNumberArray(circuitLinkLineTuples)

	for (let i = 0; i < stringPanelLinkLines.length; i += 1) {
		const lines = stringPanelLinkLines[i]
		drawCurvedNumberLines(ctx, lines)
	}
	// console.log('circuitCurvedLines', circuitCurvedLines)
	/*	for (let i = 0; i < circuitLinkLineTuples.length; i += 1) {
	 const lines = circuitLinkLineTuples[i][1]
	 drawCurvedNumberLines(ctx, lines)
	 }*/
}

const drawLinkChainCurvedPath = (ctx: CanvasRenderingContext2D, points: number[]) => {
	let controlPoints: number[] = []
	for (let i = 0; i < points.length - 2; i += 1) {
		controlPoints = controlPoints.concat(
			calculateControlPoints(
				points[2 * i],
				points[2 * i + 1],
				points[2 * i + 2],
				points[2 * i + 3],
				points[2 * i + 4],
				points[2 * i + 5],
			),
		)
	}
	const curvedLines = createCurvedNumberLines(points, controlPoints)
	drawCurvedNumberLines(ctx, curvedLines)
}

const calculateControlPoints = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x3: number,
	y3: number,
) => {
	const tension = 0.5

	const args = [x1, y1, x2, y2, x3, y3]
	const startAndFinishVector = calculateVector(args, 0, 2)
	const startToMiddleDistance = calculateDistance(args, 0, 1)
	const middleToEndDistance = calculateDistance(args, 1, 2)
	const totalDistance = startToMiddleDistance + middleToEndDistance
	return [
		x2 - (startAndFinishVector[0] * tension * startToMiddleDistance) / totalDistance,
		y2 - (startAndFinishVector[1] * tension * startToMiddleDistance) / totalDistance,
		x2 + (startAndFinishVector[0] * tension * middleToEndDistance) / totalDistance,
		y2 + (startAndFinishVector[1] * tension * middleToEndDistance) / totalDistance,
	]
}

const calculateVector = (arr: number[], i: number, j: number) => {
	const x1 = arr[2 * i]
	const y1 = arr[2 * i + 1]
	const x2 = arr[2 * j]
	const y2 = arr[2 * j + 1]
	const dx = x2 - x1
	const dy = y2 - y1
	return [dx, dy]
}

const calculateDistance = (arr: number[], i: number, j: number) => {
	const dx = arr[2 * i] - arr[2 * j]
	const dy = arr[2 * i + 1] - arr[2 * j + 1]
	return Math.sqrt(dx * dx + dy * dy)
}

const createCurvedNumberLines = (points: number[], controlPoints: number[]) => {
	const lines: CurvedNumberLine[] = []
	const amountOfPoints = points.length / 2
	if (amountOfPoints < 2) return []
	if (amountOfPoints == 2) {
		const lineToLineStart: LineToLineNumberLine = [points[0], points[1], points[2], points[3]]
		lines.push(lineToLineStart)
		return lines
	}
	const quadraticLineStart: QuadraticNumberLine = [
		points[0],
		points[1],
		controlPoints[0],
		controlPoints[1],
		points[2],
		points[3],
	]
	lines.push(quadraticLineStart)
	let i
	for (i = 2; i < amountOfPoints - 1; i += 1) {
		const bezierLine = createBezierNumberLine(points, controlPoints, i)
		lines.push(bezierLine)
	}
	const quadraticLineEnd = createQuadraticNumberLine(points, controlPoints, i)
	lines.push(quadraticLineEnd)
	return lines
}

const drawCurvedNumberLines = (ctx: CanvasRenderingContext2D, lines: CurvedNumberLine[]) => {
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i]
		switch (line.length) {
			case 4:
				drawStraightLineNumbers(ctx, line, i === 0, i === 0)
				break
			case 6:
				drawQuadraticLineNumbers(ctx, line, i === 0, i === lines.length - 1)
				break
			case 8:
				drawBezierLineNumbers(ctx, line)
				break
		}
	}
}

const drawCurvedPath = (
	ctx: CanvasRenderingContext2D,
	controlPoints: number[],
	points: number[],
) => {
	const amountOfPoints = points.length / 2
	if (amountOfPoints < 2) return
	if (amountOfPoints == 2) {
		const lineToLineStart: LineToLineNumberLine = [points[0], points[1], points[2], points[3]]
		drawStraightLineNumbers(ctx, lineToLineStart, true, true)
		return
	}
	const quadraticLineStart: QuadraticNumberLine = [
		points[0],
		points[1],
		controlPoints[0],
		controlPoints[1],
		points[2],
		points[3],
	]
	drawQuadraticLineNumbers(ctx, quadraticLineStart, true)
	let i
	for (i = 2; i < amountOfPoints - 1; i += 1) {
		const bezierLine = createBezierNumberLine(points, controlPoints, i)
		drawBezierLineNumbers(ctx, bezierLine)
	}
	const quadraticLineEnd = createQuadraticNumberLine(points, controlPoints, i)
	drawQuadraticLineNumbers(ctx, quadraticLineEnd, false, true)
}

const createBezierNumberLine = (
	points: number[],
	controlPoints: number[],
	i: number,
): BezierNumberLine => [
	points[i * 2 - 2],
	points[i * 2 - 1],
	controlPoints[(2 * (i - 1) - 1) * 2],
	controlPoints[(2 * (i - 1) - 1) * 2 + 1],
	controlPoints[2 * (i - 1) * 2],
	controlPoints[2 * (i - 1) * 2 + 1],
	points[i * 2],
	points[i * 2 + 1],
]

const createQuadraticNumberLine = (
	points: number[],
	controlPoints: number[],
	i: number,
): QuadraticNumberLine => [
	points[i * 2 - 2],
	points[i * 2 - 1],
	controlPoints[(2 * (i - 1) - 1) * 2],
	controlPoints[(2 * (i - 1) - 1) * 2 + 1],
	points[i * 2],
	points[i * 2 + 1],
]
