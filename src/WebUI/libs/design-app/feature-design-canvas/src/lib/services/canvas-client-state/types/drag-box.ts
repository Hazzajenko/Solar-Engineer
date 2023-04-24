import { TransformedPoint } from '../../../types'

export type DragBoxState = {
  dragBoxStart: TransformedPoint | undefined
  axisLineStart: TransformedPoint | undefined
}

export const InitialDragBoxState: DragBoxState = {
  dragBoxStart: undefined,
  axisLineStart: undefined,
}