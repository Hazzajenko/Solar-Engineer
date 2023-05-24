import { PanelModel } from '@entities/shared'
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
