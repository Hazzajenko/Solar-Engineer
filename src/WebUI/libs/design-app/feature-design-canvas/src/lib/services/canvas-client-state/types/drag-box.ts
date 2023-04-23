import { TransformedPoint } from '../../../types'

export type DragBoxState = {
  start: TransformedPoint | undefined
  axisLineStart: TransformedPoint | undefined
}

export const InitialDragBoxState: DragBoxState = {
  start: undefined,
  axisLineStart: undefined,
}