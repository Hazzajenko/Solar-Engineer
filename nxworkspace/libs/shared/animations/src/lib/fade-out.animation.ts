import { animate, style, transition, trigger } from '@angular/animations'

const exitTransition = transition(':leave', [
  style({
    opacity: 1,
  }),
  animate(
    '1s ease-out',
    style({
      opacity: 0,
    }),
  ),
])
export const fadeOutAnimation = trigger('fadeOutAnimation', [exitTransition])