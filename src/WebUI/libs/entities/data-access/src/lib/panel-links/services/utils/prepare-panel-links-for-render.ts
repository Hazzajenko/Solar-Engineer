import { createCurvedLinkPathLines, reduceLinkPointsToNumberArrayOptimised } from '@entities/utils'
import { StringCircuitChains } from '@entities/shared'

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

	return openCircuitCurvedLines.concat(closedCircuitCurvedLines)
}
