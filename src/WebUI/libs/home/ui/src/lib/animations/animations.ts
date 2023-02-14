import { transition, style, animate, trigger, state } from "@angular/animations"

const enterTransition = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    '1s ease-in',
    style({
      opacity: 1,
    }),
  ),
])

const enterTransitionV2 = transition(':enter', [
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
export const fadeIn = trigger('fadeIn', [enterTransition])
export const fadeInV2 = trigger('fadeInV2', [enterTransitionV2])
export const fadeOut = trigger('fadeOut', [exitTransition])
export const fadeInOut = trigger('fadeInOut', [
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
