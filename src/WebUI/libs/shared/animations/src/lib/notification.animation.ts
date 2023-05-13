// Entering: "transform ease-out duration-300 transition"
// From: "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
// To: "translate-y-0 opacity-100 sm:translate-x-0"
// Leaving: "transition ease-in duration-100"
// From: "opacity-100"
// To: "opacity-0"
import { animate, style, transition, trigger } from '@angular/animations'

export const notificationAnimation = trigger('notificationAnimation', [
	transition(':enter', [
		style({
			opacity: 0,
			transform: 'translateY(-2rem)',
		}),
		animate(
			'0.3s ease-out',
			style({
				opacity: 1,
				transform: 'translateY(0)',
			}),
		),
	]),
	transition(':leave', [
		style({
			opacity: 1,
		}),
		animate(
			'0.3s ease-in',
			style({
				opacity: 0,
			}),
		),
	]),
])
