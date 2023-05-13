import { animate, group, query, state, style, transition, trigger } from '@angular/animations'

const fadeRightTransition = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    // '1s ease-out forwards',
    '0.5s ease-in',
    style({
      opacity: 1,
    }),
  ),
])

export const fadeRight = trigger('fadeRight', [fadeRightTransition])

export const goRight = trigger('goRight', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-100%)',
    }),
    animate(
      '0.5s ease-in',
      style({
        opacity: 1,
        transform: 'translateX(0%)',
      }),
    ),
  ]),
])

export const goRight2 = trigger('goRight2', [
  state(
    'false',
    style({
      opacity: 0,
      transform: 'translateX(0%)',
      // transform: 'translateX(-100%)',
    }),
  ),
  state(
    'true',
    style({
      opacity: 1,
      // transform: 'translateX(-100%)',
      transform: 'translateX(100%)',
      // transform: 'translateX(0%)',
    }),
  ),
  transition('false <=> true', animate(500)),
])

export const increaseWidthAnimation = trigger('increaseWidth', [
  state(
    'false',
    style({
      // width: '100px',
      width: '80px',
    }),
  ),
  state(
    'true',
    style({
      width: '400px',
      // width: '400%',
    }),
  ),
  transition('false <=> true', animate(250)),
])

/*export const slideInAnimation = trigger('routeAnimations', [
  transition('HomePage => AboutPage', slideTo('left')),
  transition('AboutPage => HomePage', slideTo('right')),
  transition('HomePage => ContactPage', slideTo('left')),
  transition('ContactPage => HomePage', slideTo('right')),
  transition('AboutPage => ContactPage', slideTo('left')),
  transition('ContactPage => AboutPage', slideTo('right')),
])

function slideTo(direction) {


}*/

const left = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(
      ':enter',
      [
        style({ transform: 'translateX(-100%)' }),
        animate('.3s ease-out', style({ transform: 'translateX(0%)' })),
      ],
      {
        optional: true,
      },
    ),
    query(
      ':leave',
      [
        style({ transform: 'translateX(0%)' }),
        animate('.3s ease-out', style({ transform: 'translateX(100%)' })),
      ],
      {
        optional: true,
      },
    ),
  ]),
]
