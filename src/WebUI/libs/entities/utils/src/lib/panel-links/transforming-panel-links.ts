import { PanelLinkId, PanelLinkModel } from '@entities/shared'
import { groupLinkPointsByChain } from './sorting-panel-links'
import { CurvedNumberLine } from '@canvas/shared'

export const reduceLinkPointsToNumberArray = (links: PanelLinkModel[]): number[] =>
	links.reduce((acc, link, index) => {
		if (index === 0) {
			return [
				link.linePoints[0].x,
				link.linePoints[0].y,
				link.linePoints[1].x,
				link.linePoints[1].y,
			]
		}
		const firstPoint = link.linePoints[1]
		if (links[index + 1]) {
			const lastPoint = links[index + 1].linePoints[0]
			const centerPoint = {
				x: (firstPoint.x + lastPoint.x) / 2,
				y: (firstPoint.y + lastPoint.y) / 2,
			}
			return [...acc, centerPoint.x, centerPoint.y]
		}
		return [...acc, firstPoint.x, firstPoint.y]
	}, [] as number[])

export const reduceLinkPointsToNumberArrayOptimised = (links: PanelLinkModel[]): number[] =>
	links.reduce((acc, link, index) => {
		if (index === 0) {
			return [
				link.linePoints[0].x,
				link.linePoints[0].y,
				link.linePoints[1].x,
				link.linePoints[1].y,
			]
		}
		return [...acc, link.linePoints[1].x, link.linePoints[1].y]
	}, [] as number[])

export const reduceLinkPointsToNumberArrayOptimisedKeepIds = (links: PanelLinkModel[]) =>
	links.reduce((acc, link, index) => {
		if (index === 0) {
			const points = [
				link.linePoints[0].x,
				link.linePoints[0].y,
				link.linePoints[1].x,
				link.linePoints[1].y,
			]
			return [link.id, points]
		}
		const points = [link.linePoints[1].x, link.linePoints[1].y]
		return [...acc, link.id, points]
	}, [] as (PanelLinkId | number[])[])

export const reduceLinkPointsToNumberArrayOptimisedKeepIdsV2 = (links: PanelLinkModel[]) =>
	links.reduce((acc, link, index) => {
		if (index === 0) {
			const points = [
				link.linePoints[0].x,
				link.linePoints[0].y,
				link.linePoints[1].x,
				link.linePoints[1].y,
			] as number[]
			return [[link.id, points]] as [PanelLinkId, number[]][]
		}
		const points = [link.linePoints[1].x, link.linePoints[1].y]
		return [...acc, [link.id, points]] as [PanelLinkId, number[]][]
	}, [] as [PanelLinkId, number[]][])

export const reduceLinkPointsToNumberArrayOptimisedKeepIdsKeepOriginalStart = (
	links: PanelLinkModel[],
) =>
	links.reduce((acc, link, index) => {
		if (index === 0) {
			const points = [
				link.linePoints[0].x,
				link.linePoints[0].y,
				link.linePoints[1].x,
				link.linePoints[1].y,
			] as number[]
			return [[link.id, points]] as [PanelLinkId, number[]][]
		}
		const points = [
			link.linePoints[0].x,
			link.linePoints[0].y,
			link.linePoints[1].x,
			link.linePoints[1].y,
		]
		// const points = [link.linePoints[1].x, link.linePoints[1].y]
		return [...acc, [link.id, points]] as [PanelLinkId, number[]][]
	}, [] as [PanelLinkId, number[]][])

export const reduceLinkChainToNumberArray = (
	linkChain: ReturnType<typeof groupLinkPointsByChain>[number],
): number[] => {
	return linkChain.reduce((acc, link) => {
		return [...acc, ...link.linePoints]
	}, [] as number[])
}

// points: [PanelLinkId, number[]][]

export const reduceLinkChainToNumberArrayOptimised = (
	points: [PanelLinkId, number[]][],
): number[] => {
	return points.reduce((acc, link) => {
		return [...acc, ...link[1]]
	}, [] as number[])
}
// linkLineTuple: [PanelLinkId, CurvedNumberLine][]

export const mapLinkChainToCurvedNumberLine = (
	linkLineTuples: [PanelLinkId, CurvedNumberLine][],
) => {
	return linkLineTuples.map((linkPointTuple) => {
		return linkPointTuple[1] as CurvedNumberLine
	})
}
export const mapStringLinkChainToDoubleNumberArray = (
	chainLinkLineTuples: [PanelLinkId, CurvedNumberLine][][],
) => {
	return chainLinkLineTuples.map((linkPointTuples) => {
		return linkPointTuples.map((linkPointTuple) => linkPointTuple[1])
	})
}

export const mapPanelLinkPointTupleFixed = (
	chainLinkLineTuples: [PanelLinkId, CurvedNumberLine][],
) => {
	return chainLinkLineTuples.map((linkPointTuple) => linkPointTuple[1]) as CurvedNumberLine[]
}
export const reducerPanelLinkPointTuple = (
	chainLinkLineTuples: [PanelLinkId, CurvedNumberLine[]][],
) => {
	return chainLinkLineTuples.reduce((acc, linkPointTuple, index) => {
		if (index === 0) {
			return linkPointTuple[1]
		}
		return [...acc, ...linkPointTuple[1]]
	}, [] as CurvedNumberLine[])
}
export const reducerPanelLinkPointDoubleTuple = (
	chainLinkLineTuples: [PanelLinkId, CurvedNumberLine[]][][],
) => {
	return chainLinkLineTuples.reduce((acc, linkPointTuples) => {
		return linkPointTuples.reduce((acc2, linkPointTuple, index2) => {
			if (index2 === 0) {
				return linkPointTuple[1]
			}
			return [...acc2, ...linkPointTuple[1]]
		}, [] as CurvedNumberLine[])
	}, [] as CurvedNumberLine[])
}
