// Entering: "transition ease-out duration-100"
// From: "transform opacity-0 scale-95"
// To: "transform opacity-100 scale-100"
// Leaving: "transition ease-in duration-75"
// From: "transform opacity-100 scale-100"
// To: "transform opacity-0 scale-95"

import { animate, style, transition, trigger } from '@angular/animations'

export const transitionContextMenu = trigger('transitionContextMenu', [
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

/*
 export const goBottom = trigger('goBottom', [
 transition(':enter', [
 style({
 opacity: 0,
 transform: 'translateY(-100%)',
 }),
 animate(
 '0.25s ease-in',
 style({
 opacity: 1,
 transform: 'translateY(0%)',
 }),
 ),
 ]),
 ])
 */
