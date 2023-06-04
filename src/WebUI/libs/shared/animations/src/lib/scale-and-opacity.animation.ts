import { animate, style, transition, trigger } from '@angular/animations'

export const increaseScaleAndOpacity = trigger('increaseScaleAndOpacity', [
	transition(':enter', [
		style({
			opacity: 0,
			transform: 'scale(0.95)',
		}),
		animate(
			'0.1s ease-in',
			style({
				opacity: 1,
				transform: 'scale(1)',
			}),
		),
	]),
])
