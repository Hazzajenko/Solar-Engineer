import {
	PanelLinkId,
	PanelLinkModel,
	PanelLinkRequest,
	PanelModel,
	StringId,
} from '@entities/shared'
import { CurvedNumberLine } from '@canvas/shared'
import { pushCustomPanelLinkPointV2, updatePanelLinkPoints } from '@entities/utils'
import { getUpdatedPanelLinksForRender } from '@entities/data-access'
import {
	checkIfManyPanelIdsAreWithPanelLink,
	checkIfPanelIdIsWithPanelLink,
} from './render-link-path-links'
import { CanvasRenderOptions } from '../../../../types'
import { TransformedPoint } from '@shared/data-access/models'

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
		| 'draggingSymbolLinkLine'
	>
>
export const handleCustomEntitiesBeforeLinkRender = (
	circuitLinkLineTuples: [PanelLinkId, CurvedNumberLine][][],
	stringPanelLinks: PanelLinkModel[],
	selectedStringId: StringId,
	options: CustomRenderingOptions | undefined, // draggingSymbolLinkLinePanelWithSymbol: PanelWithSymbol | undefined,
	panelLinkRequest:
		| {
				request: PanelLinkRequest
				currentPoint: TransformedPoint
				panel: PanelModel
				nearbyPanelToLinkLine: PanelModel | undefined
		  }
		| undefined,
) => {
	// if (!stringPanelLinks.length) return circuitLinkLineTuples

	const {
		singleToMoveId,
		multipleToMoveIds,
		singleToMovePanel,
		multipleToMovePanels,
		singleToRotateId,
		singleToRotatePanel,
		multipleToRotateIds,
		multipleToRotatePanels,
		draggingSymbolLinkLine,
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

	/*	if (draggingSymbolLinkLine && draggingSymbolLinkLinePanelWithSymbol) {
	 const { transformedPoint, nearbyPanelToLinkLine } = draggingSymbolLinkLine

	 const updatedPanelLinks = pushCustomPanelLinkPoint(
	 stringPanelLinks, // mouseDownPanelSymbol,
	 transformedPoint,
	 selectedStringId,
	 draggingSymbolLinkLinePanelWithSymbol,
	 nearbyPanelToLinkLine,
	 )
	 customLinkLineTuples = getUpdatedPanelLinksForRender(updatedPanelLinks)
	 }*/

	if (panelLinkRequest) {
		const { panel, nearbyPanelToLinkLine, currentPoint } = panelLinkRequest
		const updatedPanelLinks = pushCustomPanelLinkPointV2(
			stringPanelLinks, // mouseDownPanelSymbol,
			currentPoint,
			selectedStringId,
			panel,
			nearbyPanelToLinkLine,
		)
		customLinkLineTuples = getUpdatedPanelLinksForRender(updatedPanelLinks)
		/*		const { panelLink, transformedPoint, nearbyPanelToLinkLine } = panelLinkRequest
		 const updatedPanelLinks = pushCustomPanelLinkPoint(
		 stringPanelLinks,
		 panelLink,
		 transformedPoint,
		 selectedStringId,
		 draggingSymbolLinkLinePanelWithSymbol,
		 nearbyPanelToLinkLine,
		 )*/
		// customLinkLineTuples = getUpdatedPanelLinksForRender(updatedPanelLinks)
	}

	return customLinkLineTuples
}
