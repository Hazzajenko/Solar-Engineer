import { TransformedPoint } from '../../../../types'

export const CURRENT_DRAG_BOX = {
	SELECTION: 'selection',
	CREATION: 'creation',
	AXIS_LINE: 'axis-line',
} as const

export type CurrentDragBox = (typeof CURRENT_DRAG_BOX)[keyof typeof CURRENT_DRAG_BOX]

export type AdjustedDragBoxState = {
	currentDragBox: CurrentDragBox
	selectionBoxStart: TransformedPoint | undefined
	creationBoxStart: TransformedPoint | undefined
	axisLineBoxStart: TransformedPoint | undefined
}

export const InitialAdjustedDragBoxState: AdjustedDragBoxState = {
	currentDragBox: CURRENT_DRAG_BOX.SELECTION,
	selectionBoxStart: undefined,
	creationBoxStart: undefined,
	axisLineBoxStart: undefined,
}

export const DRAG_BOX_STATE = {
	STATE: 'DragBoxState',
	NO_DRAG_BOX: 'DragBoxState.NoDragBox',
	DRAG_BOX_IN_PROGRESS: 'DragBoxState.DragBoxInProgress',
} as const

export type DragBoxState = (typeof DRAG_BOX_STATE)[keyof typeof DRAG_BOX_STATE]

// NoDragBox
// DragBoxInProgress

/*

 export type AdjustedPointerState = {
 pointerDown: boolean
 currentTransformedPoint: TransformedPoint | undefined
 hoveringEntityId: string | undefined
 }

 export const InitialAdjustedPointerState: AdjustedPointerState = {
 pointerDown: false,
 currentTransformedPoint: undefined,
 hoveringEntityId: undefined,
 }

 export const POINTER_STATE = {
 POINTER_UP: 'PointerUp',
 POINTER_DOWN: 'PointerDown',
 HOVERING_OVER_ENTITY: 'HoveringOverEntity',
 } as const

 export type PointerState = (typeof POINTER_STATE)[keyof typeof POINTER_STATE]*/