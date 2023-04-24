import { TransformedPoint } from '../../../types'

export type DragBoxStateDeprecated = {
	dragBoxStart: TransformedPoint | undefined
	axisLineStart: TransformedPoint | undefined
}

export const InitialDragBoxState: DragBoxStateDeprecated = {
	dragBoxStart: undefined,
	axisLineStart: undefined,
}