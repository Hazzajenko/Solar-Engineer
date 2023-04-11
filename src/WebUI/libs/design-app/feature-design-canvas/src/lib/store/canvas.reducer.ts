import { CanvasActions } from './canvas.actions'
import { Action, createReducer, on } from '@ngrx/store'

export const CANVAS_FEATURE_KEY = 'canvas'

export interface CanvasState {
  canvas: HTMLCanvasElement | undefined
  ctx: CanvasRenderingContext2D | undefined
  drawTime: string
}

export const initialCanvasState: CanvasState = {
  canvas: undefined,
  ctx: undefined,
  drawTime: new Date().getTime().toString(),
}

const reducer = createReducer(
  initialCanvasState,
  on(CanvasActions.drawCanvas, (state) => ({
    ...state,
    drawTime: new Date().getTime().toString(),
  })),
  on(CanvasActions.setCanvas, (state, { canvas }) => ({
    ...state,
    canvas,
  })),
  on(CanvasActions.setCtx, (state, { ctx }) => ({
    ...state,
    ctx,
  })),
)

export function canvasReducer(state: CanvasState | undefined, action: Action) {
  return reducer(state, action)
}