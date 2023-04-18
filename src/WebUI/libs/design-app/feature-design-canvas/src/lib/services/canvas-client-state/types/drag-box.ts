import { TransformedPoint } from '../../../types'

export type DragBoxState = {
  start: TransformedPoint | undefined
}

export const InitialDragBoxState: DragBoxState = {
  start: undefined,
}