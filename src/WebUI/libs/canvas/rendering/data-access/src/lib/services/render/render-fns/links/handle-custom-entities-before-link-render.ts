import { PanelLinkId, PanelLinkModel } from '@entities/shared'
import { CurvedNumberLine } from '@canvas/shared'
import { updatePanelLinkPoints } from '@entities/utils'
import { getUpdatedPanelLinksForRender } from '@entities/data-access'
import {
	checkIfManyPanelIdsAreWithPanelLink,
	checkIfPanelIdIsWithPanelLink,
} from './render-link-path-links'
import { CanvasRenderOptions } from '../../../../types'

type CustomRenderingOptions = Partial<
	Pick<
		CanvasRenderOptions,
		| 'singleToMoveId'
		| 'multipleToMoveIds'
		| 'singleToRotateId'
		| 'multipleToRotateIds'
		| 'singleToMovePanel'
		| 'multipleToMovePanels'
		| 'singleToRotatePanel'
		| 'multipleToRotatePanels'
	>
>
export const handleCustomEntitiesBeforeLinkRender = (
	circuitLinkLineTuples: [PanelLinkId, CurvedNumberLine][][],
	stringPanelLinks: PanelLinkModel[],
	options: CustomRenderingOptions | undefined,
) => {
	const {
		singleToMoveId,
		multipleToMoveIds,
		singleToMovePanel,
		multipleToMovePanels,
		singleToRotateId,
		singleToRotatePanel,
		multipleToRotateIds,
		multipleToRotatePanels,
	} = options || {}
	let customLinkLineTuples: [PanelLinkId, CurvedNumberLine][][] = circuitLinkLineTuples

	if (singleToMoveId && singleToMovePanel) {
		const check = checkIfPanelIdIsWithPanelLink(singleToMoveId, stringPanelLinks)
		if (check) {
			const updatedPanelLinks = updatePanelLinkPoints(stringPanelLinks, [singleToMovePanel])
			customLinkLineTuples = getUpdatedPanelLinksForRender(updatedPanelLinks)
		}
	}
	if (multipleToMoveIds && multipleToMovePanels) {
		const check = checkIfManyPanelIdsAreWithPanelLink(multipleToMoveIds, stringPanelLinks)
		if (check) {
			const updatedPanelLinks = updatePanelLinkPoints(stringPanelLinks, multipleToMovePanels)
			customLinkLineTuples = getUpdatedPanelLinksForRender(updatedPanelLinks)
		}
	}

	if (singleToRotateId && singleToRotatePanel) {
		const check = checkIfPanelIdIsWithPanelLink(singleToRotateId, stringPanelLinks)
		if (check) {
			const updatedPanelLinks = updatePanelLinkPoints(stringPanelLinks, [singleToRotatePanel])
			customLinkLineTuples = getUpdatedPanelLinksForRender(updatedPanelLinks)
		}
	}

	if (multipleToRotateIds && multipleToRotatePanels) {
		const check = checkIfManyPanelIdsAreWithPanelLink(multipleToRotateIds, stringPanelLinks)
		if (check) {
			const updatedPanelLinks = updatePanelLinkPoints(stringPanelLinks, multipleToRotatePanels)
			customLinkLineTuples = getUpdatedPanelLinksForRender(updatedPanelLinks)
		}
	}

	return customLinkLineTuples
}
