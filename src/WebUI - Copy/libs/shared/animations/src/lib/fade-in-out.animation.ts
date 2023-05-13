import { animate, state, style, transition, trigger } from '@angular/animations'

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  state(
    'open',
    style({
      opacity: 1,
    }),
  ),
  state(
    'close',
    style({
      opacity: 0,
    }),
  ),
  transition('open => close', [animate('1s ease-out')]),
  transition('close => open', [animate('1s ease-in')]),
])
