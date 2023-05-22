import { CanvasPanel, PanelLinkId, PanelLinkModel } from '@entities/shared'
import { CurvedNumberLine } from '@canvas/shared'
import { updatePanelLinkPoints } from '@entities/utils'
import { getUpdatedPanelLinksForRender } from '@entities/data-access'
import {
	checkIfManyPanelIdsAreWithPanelLink,
	checkIfPanelIdIsWithPanelLink,
} from './render-link-path-links'

export const handleCustomEntitiesBeforeLinkRender = (
	circuitLinkLineTuples: [PanelLinkId, CurvedNumberLine][][],
	stringPanelLinks: PanelLinkModel[],
	singleToMoveId: string | undefined,
	singleToMovePanel: CanvasPanel | undefined,
	multipleToMoveIds: string[] | undefined,
	multipleToMovePanels: CanvasPanel[] | undefined,
) => {
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
	return customLinkLineTuples
}
