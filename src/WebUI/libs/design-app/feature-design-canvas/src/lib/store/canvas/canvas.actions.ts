import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const CanvasActions = createActionGroup({
  source: 'Canvas Store',
  events: {
    'Set Canvas': props<{
      canvas: HTMLCanvasElement
    }>(),
    'Set Ctx': props<{
      ctx: CanvasRenderingContext2D
    }>(),
    'Set Canvas Size': props<{
      width: number
      height: number
    }>(),
    'Set Canvas Scale': props<{
      scale: number
    }>(),
    'Start Rotate': props<{
      x: number
      y: number
    }>(),
    Rotate: props<{
      x: number
      y: number
    }>(),
    'Draw Canvas': emptyProps(),
  },
})