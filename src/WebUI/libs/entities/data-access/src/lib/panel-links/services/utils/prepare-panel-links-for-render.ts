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
		// console.log('numberPoints', idIndex, numberPoints)
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
	// console.log('createCurvedNumberLines', lines)
	const reduce = lines.reduce((acc, line, index) => {
		const panelLinkId = linkPointTuples[index][0]
		if (index === 0) {
			return [[panelLinkId, line]] as [PanelLinkId, CurvedNumberLine][]
		}
		return [...acc, [panelLinkId, line]] as [PanelLinkId, CurvedNumberLine][]
	}, [] as [PanelLinkId, CurvedNumberLine][])
	// console.log('amountOfLinksToLines', amountOfLinks, lines.length)
	// console.log('reduce', reduce)
	return reduce
}

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
