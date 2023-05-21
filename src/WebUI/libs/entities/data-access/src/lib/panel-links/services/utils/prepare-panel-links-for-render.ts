import {
	calculateControlPoints,
	createCurvedNumberLines,
	mapStringLinkChainToDoubleNumberArray,
	reduceLinkChainToNumberArrayOptimised,
	reduceLinkPointsToNumberArrayOptimisedKeepIdsV2,
} from '@entities/utils'
import { PanelLinkId, StringCircuitChains } from '@entities/shared'
import { CurvedNumberLine } from '@canvas/shared'

export const preparePanelLinksForRenderV3 = (stringCircuitChains: StringCircuitChains) => {
	const { openCircuitChains, closedCircuitChains } = stringCircuitChains
	const openCircuitCurvedLines = openCircuitChains.map((chain) => {
		// const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsKeepOriginalStart(chain)
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsV2(chain)
		return createCurvedLinkPathLinesReworkV2(flatPoints)
	})

	const closedCircuitCurvedLines = closedCircuitChains.map((chain) => {
		// const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsKeepOriginalStart(chain)
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsV2(chain)
		return createCurvedLinkPathLinesReworkV2(flatPoints)
	})

	const stringCircuitChain = openCircuitCurvedLines.concat(closedCircuitCurvedLines)
	const stringPanelLinkLines = mapStringLinkChainToDoubleNumberArray(stringCircuitChain)

	return {
		stringCircuitChain,
		stringPanelLinkLines,
	}
}

const createCurvedLinkPathLinesReworkV2 = (linkPointTuples: [PanelLinkId, number[]][]) => {
	const points = reduceLinkChainToNumberArrayOptimised(linkPointTuples)
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
	const lines = createCurvedNumberLines(points, controlPoints)
	// console.log(points.length)
	// console.log(lines.length)
	// let pointIndex = 0

	/*	const linesForLinks = lines.map((line) => {
	 const linkPointTupleForLine = linkPointTuples.find(
	 (linkPointTuple) => linkPointTuple[1][0] === line[0],
	 )
	 assertNotNull(linkPointTupleForLine)
	 const panelLinkId = linkPointTupleForLine[0]
	 return [panelLinkId, line] as [PanelLinkId, CurvedNumberLine]
	 })
	 return linesForLinks*/

	return lines.reduce((acc, line, index) => {
		const panelLinkId = linkPointTuples[index][0]
		if (index === 0) {
			return [[panelLinkId, line]] as [PanelLinkId, CurvedNumberLine][]
		}
		return [...acc, [panelLinkId, line]] as [PanelLinkId, CurvedNumberLine][]
	}, [] as [PanelLinkId, CurvedNumberLine][])
}

const createCurvedLinkPathLinesReworkV3 = (linkPointTuples: [PanelLinkId, number[]][]) => {
	const points = reduceLinkChainToNumberArrayOptimised(linkPointTuples)
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
	const lines = createCurvedNumberLines(points, controlPoints)
	return lines.reduce((acc, line, index) => {
		const panelLinkId = linkPointTuples[index][0]
		if (index === 0) {
			return [[panelLinkId, line]] as [PanelLinkId, CurvedNumberLine][]
		}
		return [...acc, [panelLinkId, line]] as [PanelLinkId, CurvedNumberLine][]
	}, [] as [PanelLinkId, CurvedNumberLine][])
}
