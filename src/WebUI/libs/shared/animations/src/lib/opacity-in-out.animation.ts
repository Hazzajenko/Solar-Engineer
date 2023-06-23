import { animate, style, transition, trigger } from '@angular/animations'

export const opacityInOutAnimation = trigger('opacityInOut', [
	transition(':enter', [
		style({
			opacity: 0,
		}),
		animate(
			'0.1s ease-in',
			style({
				opacity: 1,
			}),
		),
	]),
	transition(':leave', [
		style({
			opacity: 1,
		}),
		animate(
			'0.1s ease-in',
			style({
				opacity: 0,
			}),
		),
	]),
])
