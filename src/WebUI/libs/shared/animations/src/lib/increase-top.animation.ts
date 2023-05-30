import { animate, state, style, transition, trigger } from '@angular/animations'

export const increaseTop = trigger('increaseTop', [
	state('true', style({ height: '*' })),
	state('false', style({ height: '56px' })),
	transition('false <=> true', animate(500)) /*transition(':enter', [
	 style({
	 // opacity: 0,
	 transform: 'translateY(-100%)',
	 }),
	 animate(
	 '0.25s ease-in',
	 style({
	 // opacity: 1,
	 transform: 'translateY(0%)',
	 }),
	 ),
	 ]),*/,
])
