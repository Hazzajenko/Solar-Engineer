import { PanelLinkModel } from '@entities/shared'

export const panelLinksToNumberArray = (linksInOrder: PanelLinkModel[]): number[] => {
	return linksInOrder.reduce((acc, link, index) => {
		if (index === 0) {
			return [
				link.linePoints[0].x,
				link.linePoints[0].y,
				link.linePoints[1].x,
				link.linePoints[1].y,
			]
		}
		const firstPoint = link.linePoints[1]
		if (linksInOrder[index + 1]) {
			const lastPoint = linksInOrder[index + 1].linePoints[0]
			const centerPoint = {
				x: (firstPoint.x + lastPoint.x) / 2,
				y: (firstPoint.y + lastPoint.y) / 2,
			}
			return [...acc, centerPoint.x, centerPoint.y]
		}
		return [...acc, firstPoint.x, firstPoint.y]
	}, [] as number[])
}
