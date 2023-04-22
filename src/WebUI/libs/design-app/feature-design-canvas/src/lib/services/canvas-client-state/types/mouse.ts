import { TransformedPoint } from '../../../types'

export type MouseState = {
  mouseDown: boolean
  point: TransformedPoint | undefined
}

export const InitialMouseState: MouseState = {
  mouseDown: false,
  point: undefined,
}