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
    'Draw Canvas': emptyProps(),
  },
})