import { createCurvedLinkPathLines, reduceLinkPointsToNumberArrayOptimised } from '@entities/utils'
import { StringCircuitChains } from '@entities/shared'
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
