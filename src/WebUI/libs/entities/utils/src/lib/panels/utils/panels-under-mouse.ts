import { PanelId, PanelModel } from '@entities/shared'
import { TransformedPoint } from '@shared/data-access/models'
import {
	isPointInsidePanelSymbolsV2,
	isPointInsidePanelSymbolsV3,
	isPointInsideStretchedEntityByValue,
} from '@canvas/utils'

export const getPanelSymbolUnderMouse = (panels: PanelModel[], point: TransformedPoint) => {
	const entitiesUnderMouse = panels.filter((entity) =>
		isPointInsideStretchedEntityByValue(point, entity, 5),
	)
	if (entitiesUnderMouse.length === 0) return undefined
	const polaritySymbol = entitiesUnderMouse.find((entity) =>
		isPointInsidePanelSymbolsV2(point, entity),
	)
	return polaritySymbol ? isPointInsidePanelSymbolsV2(point, polaritySymbol) : undefined
}

export const getPanelWithSymbolUnderMouse = (panels: PanelModel[], point: TransformedPoint) => {
	const entitiesUnderMouse = panels.filter((entity) =>
		isPointInsideStretchedEntityByValue(point, entity, 5),
	)
	if (entitiesUnderMouse.length === 0) return undefined
	const polaritySymbol = entitiesUnderMouse.find((entity) =>
		isPointInsidePanelSymbolsV3(point, entity),
	)
	return polaritySymbol ? isPointInsidePanelSymbolsV3(point, polaritySymbol) : undefined
}

export const getPanelNearbyInLinkMode = (panels: PanelModel[], point: TransformedPoint) => {
	const panelsNearMouse = panels.filter((entity) =>
		isPointInsideStretchedEntityByValue(point, entity, 10),
	)
	if (panelsNearMouse.length === 0) return undefined
	if (panelsNearMouse.length === 1) return panelsNearMouse[0]

	const sortedByClosedDistance = panelsNearMouse.sort((a, b) => {
		const distanceA = Math.sqrt(
			Math.pow(point.x - a.location.x, 2) + Math.pow(point.y - a.location.y, 2),
		)
		const distanceB = Math.sqrt(
			Math.pow(point.x - b.location.x, 2) + Math.pow(point.y - b.location.y, 2),
		)
		return distanceA - distanceB
	})

	return sortedByClosedDistance[0]
}

export const getPanelNearbyInLinkModeExcludingOne = (
	panels: PanelModel[],
	point: TransformedPoint,
	panelId: PanelId,
) => {
	const panelsNearMouse = panels.filter(
		(entity) => entity.id !== panelId && isPointInsideStretchedEntityByValue(point, entity, 10),
	)
	if (panelsNearMouse.length === 0) return undefined
	if (panelsNearMouse.length === 1) return panelsNearMouse[0]

	const sortedByClosedDistance = panelsNearMouse.sort((a, b) => {
		const distanceA = Math.sqrt(
			Math.pow(point.x - a.location.x, 2) + Math.pow(point.y - a.location.y, 2),
		)
		const distanceB = Math.sqrt(
			Math.pow(point.x - b.location.x, 2) + Math.pow(point.y - b.location.y, 2),
		)
		return distanceA - distanceB
	})

	return sortedByClosedDistance[0]
}

/*
 export const getPanelUnderMouse = createSelector(
 (state: any) => state.panels,
 (state: any) => state.mouse,
 (panels, mouse) => {
 const panelUnderMouse = panels.find((panel: any) => {
 const { x, y, width, height } = panel
 return mouse.x >= x && mouse.x <= x + width && mouse.y >= y && mouse.y <= y + height
 })
 return panelUnderMouse
 }*/
