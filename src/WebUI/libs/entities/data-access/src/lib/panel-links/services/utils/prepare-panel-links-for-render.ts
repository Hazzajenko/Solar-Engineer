import {
	calculateControlPoints,
	createCurvedNumberLines,
	reduceLinkChainToNumberArrayOptimised,
	reduceLinkPointsToNumberArrayOptimisedKeepIdsV2,
} from '@entities/utils'
import { PanelLinkId, PanelLinkModel, PanelModel, StringCircuitChains } from '@entities/shared'
import { CurvedNumberLine } from '@canvas/shared'
import { prepareStringPanelLinkCircuitChain } from './prepare-string-panel-link-circuit-chain'
import { APoint } from '@shared/utils'

export const getUpdatedPanelLinksForRender = (links: PanelLinkModel[]) => {
	const circuitChains = prepareStringPanelLinkCircuitChain(links)
	return preparePanelLinksForRender(circuitChains)
}

export const prepareStringCircuitChainForRender = (links: PanelLinkModel[]) => {
	const { openCircuitChains, closedCircuitChains } = prepareStringPanelLinkCircuitChain(links)
	const circuitLinkLines = preparePanelLinksForRender({ openCircuitChains, closedCircuitChains })
	return { openCircuitChains, closedCircuitChains, circuitLinkLines }
}
export const preparePanelLinksForRender = (stringCircuitChains: StringCircuitChains) => {
	const { openCircuitChains, closedCircuitChains } = stringCircuitChains
	const openCircuitCurvedLines = openCircuitChains.map((chain) => {
		// const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsKeepOriginalStart(chain)
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsV2(chain)
		return createCircuitCurvedLinkPathLines(flatPoints)
	})

	const closedCircuitCurvedLines = closedCircuitChains.map((chain) => {
		// const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsKeepOriginalStart(chain)
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsV2(chain)
		return createCircuitCurvedLinkPathLines(flatPoints)
	})

	return openCircuitCurvedLines.concat(closedCircuitCurvedLines)
	// const stringCircuitChain = openCircuitCurvedLines.concat(closedCircuitCurvedLines)
	// const stringPanelLinkLines = mapStringLinkChainToDoubleNumberArray(stringCircuitChain)
	/*
	 return {
	 stringCircuitChain, // stringPanelLinkLines,
	 }*/
}

export const createCircuitCurvedLinkPathLines = (linkPointTuples: [PanelLinkId, number[]][]) => {
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

export const preparePanelLinksForRenderUsingPanelLocations = (
	stringCircuitChains: StringCircuitChains,
	panels: PanelModel[],
) => {
	const { openCircuitChains, closedCircuitChains } = stringCircuitChains
	const openCircuitCurvedLines = openCircuitChains.map((chain) => {
		// const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsKeepOriginalStart(chain)
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsV2(chain)
		return createCircuitCurvedLinkPathLines(flatPoints)
	})

	const closedCircuitCurvedLines = closedCircuitChains.map((chain) => {
		// const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsKeepOriginalStart(chain)
		const flatPoints = reduceLinkPointsToNumberArrayOptimisedKeepIdsV2(chain)
		return createCircuitCurvedLinkPathLines(flatPoints)
	})

	return openCircuitCurvedLines.concat(closedCircuitCurvedLines)
	// const stringCircuitChain = openCircuitCurvedLines.concat(closedCircuitCurvedLines)
	// const stringPanelLinkLines = mapStringLinkChainToDoubleNumberArray(stringCircuitChain)
	/*
	 return {
	 stringCircuitChain, // stringPanelLinkLines,
	 }*/
}
export const createCircuitCurvedLinkPathLinesUsingPanelLocations = (
	linkPointTuples: [PanelLinkId, number[]][],
	panelIdToLocationMap: Map<PanelModel['id'], APoint>,
) => {
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
