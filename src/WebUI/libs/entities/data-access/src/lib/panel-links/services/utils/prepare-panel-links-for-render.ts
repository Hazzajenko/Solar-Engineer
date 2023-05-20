import {
	createCurvedLinkPathLines,
	reduceLinkPointsToNumberArrayOptimised,
	separatePanelLinkChains,
	sortOpenCircuitPanelLinks,
} from '@entities/utils'
import { OpenCircuitChain, PanelLinkModel } from '@entities/shared'

export const preparePanelLinksForRender = (panelLinks: PanelLinkModel[]) => {
	const groupedByLinkChain = separatePanelLinkChains(panelLinks)
	const groupedByLinkChainSorted = groupedByLinkChain.map((chain) =>
		sortOpenCircuitPanelLinks(chain as OpenCircuitChain),
	)
	const flatNumberArray = groupedByLinkChainSorted.map((chain) =>
		reduceLinkPointsToNumberArrayOptimised(chain),
	)
	return flatNumberArray.map((chain) => createCurvedLinkPathLines(chain))
}

// for (let i = 0; i < startOfChains.length; i++) {
//   const panelLink = startOfChains[i];
//   const chain: PanelLinkModel[] = [panelLink];
//   let currentPanelLink = panelLink;
//   let chainInProgress = true;

//   while (chainInProgress) {
// 	const nextPanelLink = panelLinks.find(
// 	  (pl) => pl.negativePanelId === currentPanelLink.positivePanelId
// 	);

// 	if (!nextPanelLink) {
// 	  chainInProgress = false;
// 	  chains.push(chain);
// 	  break;
// 	}

// 	chain.push(nextPanelLink);
// 	currentPanelLink = nextPanelLink;
//   }
// }

// export const separatePanelLinkChains = (panelLinks: PanelLinkModel[]) => {
// 	const startOfChains = panelLinks.filter(
// 		(panelLink) =>
// 			panelLinks
// 				.filter((otherPanelLink) => otherPanelLink.id !== panelLink.id)
// 				.find((pl) => pl.positivePanelId === panelLink.negativePanelId) === undefined,
// 	)
// 	const res2: PanelLinkModel[][] = []

// 	for (let i = 0; i < startOfChains.length; i++) {
// 		const panelLink = startOfChains[i]
// 		const panelLinkChain = [panelLink]
// 		let currentPanelLink = panelLink
// 		let panelLinkChainOrderInProcess = true
// 		while (panelLinkChainOrderInProcess) {
// 			const nextPanelLink = panelLinks.find(
// 				(pl) => pl.negativePanelId === currentPanelLink.positivePanelId,
// 			)
// 			if (!nextPanelLink) {
// 				panelLinkChainOrderInProcess = false
// 				res2.push(panelLinkChain)
// 				break
// 			}
// 			panelLinkChain.push(nextPanelLink)
// 			currentPanelLink = nextPanelLink
// 		}
// 	}
// 	return res2
// }

/*
 const reduceLinkPointsToNumberArrayOptimised = (links: PanelLinkModel[]): number[] =>
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
 /!*		const firstPoint = link.linePoints[1]
 if (links[index + 1]) {
 const lastPoint = links[index + 1].linePoints[0]
 const centerPoint = {
 x: (firstPoint.x + lastPoint.x) / 2,
 y: (firstPoint.y + lastPoint.y) / 2,
 }
 return [...acc, centerPoint.x, centerPoint.y]
 }
 return [...acc, firstPoint.x, firstPoint.y]*!/
 }, [] as number[])
 */

/*const reduceLinkPointsToNumberArrayOptimisedV2 = (links: PanelLinkModel[]): number[] =>
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
 }, [] as number[])*/
