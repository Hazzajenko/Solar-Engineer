import { EntityType } from '@design-app/shared'
import { POINTER_BUTTON } from '@shared/data-access/models'

export const dragBoxKeysDown = (event: MouseEvent): boolean => {
  return event.altKey && event.button === 0
  // return event.shiftKey && event.button === 0
}

export const draggingScreenKeysDown = (event: MouseEvent): boolean => {
  return (event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) && !event.shiftKey
}

export const isReadyToMultiDrag = (event: MouseEvent, multiSelectedIds: string[]): boolean => {
  return event.shiftKey && event.ctrlKey && multiSelectedIds.length > 0
}

export const isMultiSelectDragging = (event: MouseEvent, multiSelectedIds: string[]): boolean => {
  return event.button === 0 && event.shiftKey && event.ctrlKey && multiSelectedIds.length > 0
}
// this._selected.multiSelected.length > 0 && event.shiftKey && event.ctrlKey && !this._selected.isMultiSelectDragging

export const multiSelectDraggingKeysDown = (
  event: MouseEvent,
  multiSelectedIds: string[],
): boolean => {
  return event.shiftKey && event.ctrlKey && multiSelectedIds.length > 0
}

/*export const isDraggingEntity = (event: MouseEvent): boolean => {
 return event.button === 0 && !event.shiftKey && !event.ctrlKey
 }*/

export const rotatingKeysDown = (event: MouseEvent): boolean => {
  return event.altKey && event.ctrlKey
}

export const isContextMenu = (event: MouseEvent): boolean => {
  return event.button === 2
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
  return event.button === 0 && !event.shiftKey && !event.ctrlKey && !!entityOnMouseDown
}

/*type isDraggingEntity = (
 event: MouseEvent,
 entityOnMouseDownId: string | undefined,
 ) => entityOnMouseDownId is string & true*/

// const rotateKeys = event.altKey && event.ctrlKey

// const isMultiSelectDragging = event.shiftKey && event.ctrlKey && this._selected.multiSelected.length > 0
// const isDraggingScreen = (event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) && !event.shiftKey