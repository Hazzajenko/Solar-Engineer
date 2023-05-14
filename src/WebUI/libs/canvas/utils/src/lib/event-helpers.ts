import { EntityType, EVENT_BUTTON, POINTER_BUTTON } from '@shared/data-access/models'

export const isHoldingClick = (event: MouseEvent): boolean => {
	return event.buttons === EVENT_BUTTON.PRIMARY
	// return event.button === POINTER_BUTTON.MAIN
}
export const dragBoxKeysDown = (event: MouseEvent): boolean => {
	return event.altKey && event.buttons === EVENT_BUTTON.PRIMARY
	// return event.altKey && event.buttons === 1
	// return event.altKey && event.button === 0
	// return event.shiftKey && event.button === 0
}

export const draggingScreenKeysDown = (event: MouseEvent): boolean => {
	return (
		((event.ctrlKey && isHoldingClick(event)) || event.buttons === EVENT_BUTTON.AUXILIARY) &&
		!event.shiftKey
	)
	// return (event.ctrlKey || event.buttons === 4) && !event.shiftKey
	// return (event.ctrlKey || event.buttons === 4) && !event.shiftKey
	// return (event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) && !event.shiftKey
}

export const isReadyToMultiDrag = (event: MouseEvent, multiSelectedIds: string[]): boolean => {
	return event.shiftKey && event.ctrlKey && multiSelectedIds.length > 0
}

export const multiSelectDraggingKeysDown = (event: PointerEvent): boolean => {
	return event.buttons === EVENT_BUTTON.PRIMARY && event.shiftKey && event.ctrlKey
}
export const multiSelectDraggingKeysDownAndIdsNotEmpty = (
	event: MouseEvent,
	multiSelectedIds: string[],
): boolean => {
	return (
		event.buttons === EVENT_BUTTON.PRIMARY &&
		event.shiftKey &&
		event.ctrlKey &&
		multiSelectedIds.length > 0
	)
	// return event.button === 0 && event.shiftKey && event.ctrlKey && multiSelectedIds.length > 0
}
// this._selected.multiSelected.length > 0 && event.shiftKey && event.ctrlKey && !this._selected.isMultiSelectDragging

/*export const multiSelectDraggingKeysDown = (
 event: MouseEvent,
 multiSelectedIds: string[],
 ): boolean => {
 return event.shiftKey && event.ctrlKey && multiSelectedIds.length > 0
 }*/

/*export const isDraggingEntity = (event: MouseEvent): boolean => {
 return event.button === 0 && !event.shiftKey && !event.ctrlKey
 }*/

export const rotatingKeysDown = (event: PointerEvent): boolean => {
	return event.altKey && event.ctrlKey
}

export const isContextMenu = (event: PointerEvent): boolean => {
	return event.button === 2
}

export const isWheelButton = (event: PointerEvent): boolean => {
	return event.button === POINTER_BUTTON.WHEEL
	// return event.buttons === EVENT_BUTTON.AUXILIARY
}

export const isDraggingEntity = (
	event: MouseEvent,
	entityOnMouseDown:
		| {
				id: string
				type: EntityType
		  }
		| string
		| undefined,
): boolean => {
	return (
		event.buttons === EVENT_BUTTON.PRIMARY &&
		!event.shiftKey &&
		!event.ctrlKey &&
		!!entityOnMouseDown
	)
	// return event.button === 0 && !event.shiftKey && !event.ctrlKey && !!entityOnMouseDown
}

/*type isDraggingEntity = (
 event: MouseEvent,
 entityOnMouseDownId: string | undefined,
 ) => entityOnMouseDownId is string & true*/

// const rotateKeys = event.altKey && event.ctrlKey

// const isMultiSelectDragging = event.shiftKey && event.ctrlKey && this._selected.multiSelected.length > 0
// const isDraggingScreen = (event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) && !event.shiftKey
