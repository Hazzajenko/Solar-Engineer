import { TransformedPoint } from '@design-app/feature-design-canvas'

export type MouseState = {
  mouseDown: boolean
  point: TransformedPoint | undefined
}

export const InitialMouseState: MouseState = {
  mouseDown: false,
  point: undefined,
}