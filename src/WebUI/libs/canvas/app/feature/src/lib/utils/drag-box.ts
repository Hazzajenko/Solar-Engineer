import { TransformedPoint } from '@shared/data-access/models'
import { MODE_STATE, ModeState } from '@canvas/app/data-access'
import { getAllEntitiesBetweenTwoPoints } from '@canvas/utils'
import { PanelModel } from '@entities/shared'
// import { V } from '@angular/cdk/keycodes'
// import { V } from 'vitest/dist/types-71ccd11d'

// type ArgumentTypes<F extends (...args: any) => any> = F extends (...args: infer A) => any ? A : never
/*
 type ReturnType<F extends Function> = F extends (...args: any[]) => infer R ? R : never

 type idk = Parameters<typeof dragBoxOnMouseDownHandler>*/
// export const toFunc = <V, U extends (...args: any) => any>(func: (param: ArgumentTypes<U>) => V) => func
export const dragBoxOnMouseDownHandler = (
	event: PointerEvent,
	currentPoint: TransformedPoint,
	appMode: ModeState,
) => {
	switch (appMode) {
		case MODE_STATE.SELECT_MODE:
			return 'SelectionBoxInProgress'
		case MODE_STATE.LINK_MODE:
			return 'SelectionBoxInProgress'
		case MODE_STATE.CREATE_MODE:
			return 'CreationBoxInProgress'
	}
}

export const selectionBoxMouseUp = (
	event: PointerEvent,
	currentPoint: TransformedPoint,
	dragBoxStart: TransformedPoint,
	panels: PanelModel[],
) => {
	// const start = this.dragBoxStart
	// assertNotNull(start)
	// const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
	const panelsInArea = getAllEntitiesBetweenTwoPoints(dragBoxStart, currentPoint, panels)
	if (panelsInArea) {
		const entitiesInAreaIds = panelsInArea.map((panel) => panel.id)
		this._appStore.setDragBoxState('NoDragBox')
		this._selectedStore.dispatch.selectMultipleEntities(entitiesInAreaIds)
	} else {
		this._appStore.setDragBoxState('NoDragBox')
	}
	// this._render.renderCanvasApp()
	// this.dragBoxStart = undefined
}
