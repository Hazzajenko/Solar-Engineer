import { PanelLinkModel } from '@entities/shared'

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
