import { PanelLinkModel } from '@entities/shared'
import { APoint, centerPoint, centerPointXy } from '@shared/utils'
import { Point } from '@shared/data-access/models'

export const getPanelLinksChainContinuedLineInXyPoints = (panelLinks: PanelLinkModel[]) => {
	return panelLinks.map((panelLink) => {
		const linePoints: Point[] = []
		let currentPanelLink = panelLink
		let panelLinkChainOrderInProcess = true
		while (panelLinkChainOrderInProcess) {
			// currentPanelLink = nextPanelLink
			const nextPanelLink = panelLinks.find(
				(pl) => pl.negativePanelId === currentPanelLink.positivePanelId,
			)
			if (!nextPanelLink) {
				panelLinkChainOrderInProcess = false
				return linePoints
			}
			const commonPoint = centerPointXy(currentPanelLink.linePoints[1], nextPanelLink.linePoints[0])
			linePoints.push(commonPoint)
			currentPanelLink = nextPanelLink
		}
		return linePoints
	})
}
export const getPanelLinksChainContinuedLineInAPoints = (panelLinks: PanelLinkModel[]) => {
	return panelLinks.map((panelLink) => {
		const linePoints: APoint[] = []
		let currentPanelLink = panelLink
		let panelLinkChainOrderInProcess = true
		while (panelLinkChainOrderInProcess) {
			const nextPanelLink = panelLinks.find(
				(pl) => pl.negativePanelId === currentPanelLink.positivePanelId,
			)
			if (!nextPanelLink) {
				panelLinkChainOrderInProcess = false
				return linePoints
			}
			const point1 = convertPointToAPoint(currentPanelLink.linePoints[1])
			const point2 = convertPointToAPoint(nextPanelLink.linePoints[0])
			const commonPoint = centerPoint(point1, point2)
			linePoints.push(commonPoint)
			currentPanelLink = nextPanelLink
		}
		return linePoints
	})
}

export const convertPointToAPoint = (point: Point): APoint => {
	return [point.y, point.y]
}
