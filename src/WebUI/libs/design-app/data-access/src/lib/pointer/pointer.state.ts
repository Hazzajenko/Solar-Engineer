import { TransformedPoint } from '@design-app/feature-design-canvas'

export type PointerStateContext = {
	pointerDown: boolean
	currentTransformedPoint: TransformedPoint | undefined
	hoveringEntityId: string | undefined
}

export const InitialPointerContext: PointerStateContext = {
	pointerDown: false,
	currentTransformedPoint: undefined,
	hoveringEntityId: undefined,
}

/*
 export const POINTER_STATE_KEY = 'PointerState'

 export const POINTER_STATE = {
 POINTER_UP: 'PointerUp',
 POINTER_DOWN: 'PointerDown',
 HOVERING_OVER_ENTITY: 'HoveringOverEntity',
 } as const

 export type PointerState = (typeof POINTER_STATE)[keyof typeof POINTER_STATE]

 export const MATCHES_POINTER_STATE = {
 STATE: 'PointerState',
 POINTER_UP: 'PointerState.PointerUp',
 POINTER_DOWN: 'PointerState.PointerDown',
 HOVERING_OVER_ENTITY: 'PointerState.HoveringOverEntity',
 } as const
 */
