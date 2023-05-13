import { animate, style, transition, trigger } from '@angular/animations'

const enterTransition = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    '0.5s ease-in',
    style({
      opacity: 1,
    }),
  ),
])
export const fadeInAnimation = trigger('fadeInAnimation', [enterTransition])

const enterTransitionX2 = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    '0.25s ease-in',
    style({
      opacity: 1,
    }),
  ),
])
export const fadeInAnimationX2 = trigger('fadeInAnimationX2', [enterTransitionX2])
