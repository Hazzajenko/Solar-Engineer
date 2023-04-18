import { TransformedPoint } from '@design-app/feature-design-canvas'

export type ViewState = {
  // canvas: HTMLCanvasElement
  // ctx: CanvasRenderingContext2D
  dragStart: TransformedPoint | undefined
}

export const InitialViewState: ViewState = {
  dragStart: undefined,
}