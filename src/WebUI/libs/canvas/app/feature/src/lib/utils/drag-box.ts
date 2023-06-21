import { TransformedPoint } from '@shared/data-access/models'
import { AppStateStore, MODE_STATE } from '@canvas/app/data-access'
import {
	dragBoxKeysDown,
	getAllAvailableEntitySpotsBetweenTwoPoints,
	getAllEntitiesBetweenTwoPoints,
} from '@canvas/utils'
import { PanelModel } from '@entities/shared'
import { SelectedStore } from '@canvas/selected/data-access'
import { createPanel } from '@entities/utils'
import { PanelsStore } from '@entities/data-access'
import { createRenderOptions } from '@canvas/rendering/data-access'

export const dragBoxOnMouseDownHandler = (
	currentPoint: TransformedPoint,
	_appStore: AppStateStore,
) => {
	switch (_appStore.select.mode()) {
		case MODE_STATE.SELECT_MODE:
			return _appStore.dispatch.setDragBoxState({
				state: 'SelectionBoxInProgress',
				start: currentPoint,
			})
		case MODE_STATE.LINK_MODE:
			return _appStore.dispatch.setDragBoxState({
				state: 'SelectionBoxInProgress',
				start: currentPoint,
			})
		case MODE_STATE.CREATE_MODE:
			return _appStore.dispatch.setDragBoxState({
				state: 'CreationBoxInProgress',
				start: currentPoint,
			})
	}
}

export const dragBoxOnMouseMoveHandler = (
	event: PointerEvent | TouchEvent,
	currentPoint: TransformedPoint,
	dragBoxStart: TransformedPoint,
	panels: PanelModel[],
	_appStore: AppStateStore,
) => {
	switch (_appStore.select.mode()) {
		case MODE_STATE.SELECT_MODE:
			return selectionBoxMouseMove(event, currentPoint, dragBoxStart, _appStore)
		case MODE_STATE.LINK_MODE:
			return selectionBoxMouseMove(event, currentPoint, dragBoxStart, _appStore)
		case MODE_STATE.CREATE_MODE:
			return creationBoxMouseMove(event, currentPoint, dragBoxStart, panels, _appStore)
	}
}

export const dragBoxOnMouseUpHandler = (
	currentPoint: TransformedPoint,
	dragBoxStart: TransformedPoint,
	panels: PanelModel[],
	_appStore: AppStateStore,
	_selectedStore: SelectedStore,
	_panelsStore: PanelsStore,
) => {
	switch (_appStore.select.mode()) {
		case MODE_STATE.SELECT_MODE:
			return selectionBoxMouseUp(currentPoint, dragBoxStart, panels, _appStore, _selectedStore)
		case MODE_STATE.LINK_MODE:
			return selectionBoxMouseUp(currentPoint, dragBoxStart, panels, _appStore, _selectedStore)
		case MODE_STATE.CREATE_MODE:
			return creationBoxMouseUp(currentPoint, dragBoxStart, panels, _appStore, _panelsStore)
	}
}

export const selectionBoxMouseMove = (
	event: PointerEvent | TouchEvent,
	currentPoint: TransformedPoint,
	dragBoxStart: TransformedPoint,
	_appStore: AppStateStore,
) => {
	if (event instanceof PointerEvent) {
		if (!dragBoxKeysDown(event)) {
			_appStore.dispatch.setDragBoxState({
				state: 'NoDragBox',
			})
			return
		}
	}

	return createRenderOptions({
		selectionBox: {
			x: dragBoxStart.x,
			y: dragBoxStart.y,
			width: currentPoint.x - dragBoxStart.x,
			height: currentPoint.y - dragBoxStart.y,
		},
	})
}

export const selectionBoxMouseUp = (
	currentPoint: TransformedPoint,
	dragBoxStart: TransformedPoint,
	panels: PanelModel[],
	_appStore: AppStateStore,
	_selectedStore: SelectedStore,
) => {
	const panelsInArea = getAllEntitiesBetweenTwoPoints(dragBoxStart, currentPoint, panels)
	if (panelsInArea) {
		const entitiesInAreaIds = panelsInArea.map((panel) => panel.id)
		_appStore.dispatch.setDragBoxState({ state: 'NoDragBox' })
		_selectedStore.dispatch.selectMultiplePanels(entitiesInAreaIds)
	} else {
		_appStore.dispatch.setDragBoxState({ state: 'NoDragBox' })
	}
}

export const creationBoxMouseMove = (
	event: PointerEvent | TouchEvent,
	currentPoint: TransformedPoint,
	dragBoxStart: TransformedPoint,
	panels: PanelModel[],
	_appStore: AppStateStore,
) => {
	if (event instanceof PointerEvent) {
		if (!dragBoxKeysDown(event)) {
			_appStore.dispatch.setDragBoxState({
				state: 'NoDragBox',
			})
			return
		}
	}
	return createRenderOptions({
		creationBox: {
			x: dragBoxStart.x,
			y: dragBoxStart.y,
			width: currentPoint.x - dragBoxStart.x,
			height: currentPoint.y - dragBoxStart.y,
			spots: getAllAvailableEntitySpotsBetweenTwoPoints(dragBoxStart, currentPoint, panels),
		},
	})
}

export const creationBoxMouseUp = (
	currentPoint: TransformedPoint,
	dragBoxStart: TransformedPoint,
	panels: PanelModel[],
	_appStore: AppStateStore,
	_panelsStore: PanelsStore,
) => {
	const spots = getAllAvailableEntitySpotsBetweenTwoPoints(dragBoxStart, currentPoint, panels)
	if (!spots || !spots.length) return
	const takenSpots = spots.filter((spot) => !spot.vacant)
	if (takenSpots.length) {
		return
	}
	if (spots.length > 30) {
		console.error('Too many spots selected, max 30')
		_appStore.dispatch.setDragBoxState({
			state: 'NoDragBox',
		})
		return
	}
	const newPanels = spots.map((spot) => createPanel({ x: spot.x, y: spot.y }))
	_panelsStore.dispatch.addManyPanels(newPanels)
	_appStore.dispatch.setDragBoxState({
		state: 'NoDragBox',
	})
}
