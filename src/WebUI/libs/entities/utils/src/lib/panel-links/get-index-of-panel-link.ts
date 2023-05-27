import { PanelId, PanelLinkId, PanelLinkModel } from '@entities/shared'
import { lastOfArray } from '@shared/utils'
import { CurvedNumberLine } from '@canvas/shared'

export const getIndexOfPanelInPanelLinks = (
	panelId: PanelId,
	panelLinks: PanelLinkModel[],
): number => {
	let panelIndex = panelLinks.findIndex((link) => link?.positivePanelId === panelId)
	if (lastOfArray(panelLinks).negativePanelId === panelId) {
		panelIndex = panelLinks.length
	}
	if (panelIndex === -1) {
		const maybeLastIndex = panelLinks.findIndex((link) => link?.negativePanelId === panelId)
		if (maybeLastIndex !== -1) {
			if (maybeLastIndex === panelLinks.length - 1) {
				panelIndex = panelLinks.length
			} else {
				panelIndex = maybeLastIndex
			}
		}
	}
	return panelIndex
}

export const getIndexOfPanelLink = (
	panelLinkId: PanelLinkId,
	panelLinks: PanelLinkModel[],
): number => {
	if (lastOfArray(panelLinks).id === panelLinkId) {
		return panelLinks.length
	}
	return panelLinks.findIndex((link) => link?.id === panelLinkId)
}

export const getIndexOfPanelLinkCurvedLineTuple = (
	panelLinkId: PanelLinkId,
	panelLinkCurvedLineTuples: [PanelLinkId, CurvedNumberLine][],
): number => {
	if (lastOfArray(panelLinkCurvedLineTuples)[0] === panelLinkId) {
		return panelLinkCurvedLineTuples.length
	}
	return panelLinkCurvedLineTuples.findIndex((link) => link[0] === panelLinkId)
}

/*

 export const getIndexOfPanelLinkByPanelId = (panelId: PanelId, panelLinks: PanelLinkModel[]): number => {
 let linkIndex = panelLinks.findIndex((link) => link?.positivePanelId === panel.id)
 if (linkIndex === -1) {
 const maybeLastIndex = panelLinks.findIndex((link) => link?.negativePanelId === panel.id)
 if (maybeLastIndex !== -1) {
 if (maybeLastIndex === panelLinks.length - 1) {
 linkIndex = panelLinks.length
 } else {
 linkIndex = maybeLastIndex
 }
 }
 }
 }*/
