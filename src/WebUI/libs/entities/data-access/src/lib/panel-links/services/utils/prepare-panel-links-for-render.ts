import {
	calculateControlPoints,
	createCurvedLinkPathLines,
	createCurvedNumberLines,
	mapStringLinkChainToDoubleNumberArray,
	reduceLinkChainToNumberArrayOptimised,
	reduceLinkPointsToNumberArrayOptimised,
	reduceLinkPointsToNumberArrayOptimisedKeepIds,
	reduceLinkPointsToNumberArrayOptimisedKeepIdsV2,
} from '@entities/utils'
import { PanelLinkId, StringCircuitChains } from '@entities/shared'
import { CurvedNumberLine } from '@canvas/shared'
import { getBezierXYByTUsingNumberLine } from '@canvas/utils'
import { APoint } from '@shared/utils'

export const preparePanelLinksForRender = (stringCircuitChains: StringCircuitChains) => {
	const { openCircuitChains, closedCircuitChains } = stringCircuitChains
	const openCircuitCurvedLines = openCircuitChains.map((chain) => {
		const flatPoints = reduceLinkPointsToNumberArrayOptimised(chain)
		return createCurvedLinkPathLines(flatPoints)
	})

	const closedCircuitCurvedLines = closedCircuitChains.map((chain) => {
		const flatPoints = reduceLinkPointsToNumberArrayOptimised(chain)
		return createCurvedLinkPathLines(flatPoints)
	})

	const curvedLinesCombined = openCircuitCurvedLines.concat(closedCircuitCurvedLines)
	const microLinePoints = createMicroLinePositionsForMouseEvents(curvedLinesCombined)
	return {
		curvedLinesCombined,
		microLinePoints,
	}
}

export const preparePanelLinksForRenderV2 = (stringCircuitChains: StringCircuitChains) => {
	const { openCircuitChains, closedCircuitChains } = stringCircuitChains
	const openCircuitCurvedLines = openCircuitChains.map((chain) => {
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIds(chain)
		return stringOrNumberArrayAdapterForCurvedLines(flatPoints)
	})

	const closedCircuitCurvedLines = closedCircuitChains.map((chain) => {
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIds(chain)
		return stringOrNumberArrayAdapterForCurvedLines(flatPoints)
	})

	const curvedLinesCombined = openCircuitCurvedLines.concat(closedCircuitCurvedLines)
	// const microLinePoints = createMicroLinePositionsForMouseEvents(curvedLinesCombined)
	return {
		curvedLinesCombined, // microLinePoints,
	}
}

const stringOrNumberArrayAdapterForCurvedLines = (points: (string | number[])[]) => {
	const pointsFilteredByStrings = points.filter((point) => typeof point === 'string') as string[]

	return pointsFilteredByStrings.map((id) => {
		const idIndex = points.indexOf(id)
		const numberPoints = points[idIndex + 1] as number[]
		console.log('numberPoints', idIndex, numberPoints)
		const lines = createCurvedLinkPathLines(numberPoints)
		return [id, lines] as [string, CurvedNumberLine[]]
	})
}
export const preparePanelLinksForRenderV3 = (stringCircuitChains: StringCircuitChains) => {
	const { openCircuitChains, closedCircuitChains } = stringCircuitChains
	const openCircuitCurvedLines = openCircuitChains.map((chain) => {
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsV2(chain)
		return createCurvedLinkPathLinesReworkV2(flatPoints)
		// return panelLinkIdPointsTupleArrayAdapterForCurvedLines(flatPoints)
	})

	const closedCircuitCurvedLines = closedCircuitChains.map((chain) => {
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsV2(chain)
		return createCurvedLinkPathLinesReworkV2(flatPoints)
		// return panelLinkIdPointsTupleArrayAdapterForCurvedLines(flatPoints)
	})

	const stringCircuitChain = openCircuitCurvedLines.concat(closedCircuitCurvedLines)
	const stringPanelLinkLines = mapStringLinkChainToDoubleNumberArray(stringCircuitChain)

	return {
		stringCircuitChain,
		stringPanelLinkLines,
	}
}

/*const reducerPanelLinkPointTuple = (acc: [PanelLinkId, number[]][], point: APoint, index: number, points: APoint[]) => {
 if (index % 2 === 0) {
 acc.push([point as PanelLinkId, []])
 } else {
 acc[acc.length - 1][1].push(point as number)
 }
 return acc
 }*/

// reduceLinkPointsToNumberArrayOptimisedKeepIdsV2

const panelLinkIdPointsTupleArrayAdapterForCurvedLines = (points: [PanelLinkId, number[]][]) => {
	return points.map((linkIdAndPoints, index) => {
		const id = linkIdAndPoints[0]
		const linkPoints = linkIdAndPoints[1]

		if (index === 0) {
			if (index === points.length - 1) {
				const lines = createCurvedLinkPathLines(linkPoints)
				return [id, lines] as [PanelLinkId, CurvedNumberLine[]]
			}

			const lines = createCurvedLinkPathLinesRework(linkPoints)
			return [id, lines] as [PanelLinkId, CurvedNumberLine[]]
		}

		if (index === points.length - 1) {
			const previousPoints = points[index - 1][1]
			const last2OfPreviousPoints = previousPoints.slice(
				previousPoints.length - 2,
				previousPoints.length,
			)
			const pointsWithPrevious = last2OfPreviousPoints.concat(linkPoints)
			const lines = createCurvedLinkPathLinesRework(pointsWithPrevious)
			return [id, lines] as [PanelLinkId, CurvedNumberLine[]]
		}

		const previousPoints = points[index - 1][1]
		const nextPoints = points[index + 1][1]
		const last2OfPreviousPoints = previousPoints.slice(
			previousPoints.length - 2,
			previousPoints.length,
		)
		const first2OfNextPoints = nextPoints.slice(0, 2)
		const pointsWithPreviousAndNext = last2OfPreviousPoints.concat(linkPoints, first2OfNextPoints)
		const lines = createCurvedLinkPathLinesRework(pointsWithPreviousAndNext)
		console.log('numberPoints', id, pointsWithPreviousAndNext, lines)
		return [id, lines] as [PanelLinkId, CurvedNumberLine[]]
	})
}

const createCurvedLinkPathLinesReworkV2 = (linkPointTuples: [PanelLinkId, number[]][]) => {
	// const pointsWithIds = points.reduce(reducerPanelLinkPointTuple, [] as [PanelLinkId, number[]][])
	const amountOfLinks = linkPointTuples.length
	const points = reduceLinkChainToNumberArrayOptimised(linkPointTuples)
	let controlPoints: number[] = []
	for (let i = 0; i < points.length - 2; i += 1) {
		// const p = points[i][1]
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
	const lines = createCurvedNumberLines(points, controlPoints)
	const reduce = lines.reduce((acc, line, index) => {
		const panelLinkId = linkPointTuples[index][0]
		if (index === 0) {
			return [[panelLinkId, line]] as [PanelLinkId, CurvedNumberLine][]
		}
		return [...acc, [panelLinkId, line]] as [PanelLinkId, CurvedNumberLine][]
	}, [] as [PanelLinkId, CurvedNumberLine][])
	/*	const res = lines
	 .map((line, index) => {
	 const panelLinkId = linkPointTuples[index][0]
	 return [panelLinkId, line]
	 })
	 .flat()*/
	console.log('amountOfLinksToLines', amountOfLinks, lines.length)
	console.log('reduce', reduce)
	return reduce
}
const createCurvedLinkPathLinesRework = (points: number[]) => {
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
	return createCurvedNumberLines(points, controlPoints)
}

/*
 const createCurvedLinkPathLinesWithIds = (points: [string, number[]] | (string | number[])[]) => {
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
 return createCurvedNumberLinesWithIds(points, controlPoints)
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

 const createCurvedNumberLinesWithIds = (points: number[], controlPoints: number[]) => {
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
 }*/

const createMicroLinePositionsForMouseEvents = (chainCurvedLines: CurvedNumberLine[][]) => {
	return chainCurvedLines.map((curvedLines) => {
		return curvedLines.map((curvedLine) => {
			return switchCurvedLineToAPointArray(curvedLine)
		})
	})
}

const switchCurvedLineToAPointArray = (curvedLine: CurvedNumberLine) => {
	switch (curvedLine.length) {
		// LineToLineNumberLine
		case 4: {
			/*			const points: APoint[] = []
			 const point1 = [curvedLine[0], curvedLine[1]] as APoint
			 const point2 = [curvedLine[2], curvedLine[3]] as APoint
			 points.push(point1)
			 points.push(point2)
			 return points*/
			return []
		}

		// QuadraticBezierNumberLine
		case 6: {
			/*			const points: APoint[] = []
			 for (let t = 0; t < 1; t += 0.1) {
			 const pointAtT = getQuadraticXYByTUsingNumberLine(curvedLine, t)
			 points.push(pointAtT)
			 }
			 return points*/
			return []
		}
		// BezierNumberLine
		case 8: {
			const points: APoint[] = []
			for (let t = 0; t < 1; t += 0.1) {
				const pointAtT = getBezierXYByTUsingNumberLine(curvedLine, t)
				points.push(pointAtT)
			}
			return points
		}
	}
}
