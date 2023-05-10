import { animate, style, transition, trigger } from '@angular/animations'

// <!--
// 	Dropdown menu, show/hide based on menu state.
//
// 	Entering: "transition ease-out duration-100"
// From: "transform opacity-0 scale-95"
// To: "transform opacity-100 scale-100"
// Leaving: "transition ease-in duration-75"
// From: "transform opacity-100 scale-100"
// To: "transform opacity-0 scale-95"
// -->

/*export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
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
])*/

export const goRight = trigger('goRight', [
	transition(':enter', [
		style({
			opacity: 0,
			transform: 'translateX(-100%)',
		}),
		animate(
			'0.25s ease-in',
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
		),
	]),
])

export const goRightWithConfig = (duration: string) => {
	return trigger('goRight', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateX(-100%)',
			}),
			animate(
				`${duration} ease-in`,
				style({
					opacity: 1,
					transform: 'translateX(0%)',
				}),
			),
		]),
	])
}

export const goRightWithConfigNoOpacity = (duration: string) => {
	return trigger('goRight', [
		transition(':enter', [
			style({
				transform: 'translateX(-100%)',
			}),
			animate(
				`${duration} ease-in`,
				style({
					transform: 'translateX(0%)',
				}),
			),
		]),
	])
}

export const goLeft = trigger('goLeft', [
	transition(':enter', [
		style({
			opacity: 0,
			transform: 'translateX(100%)',
		}),
		animate(
			'0.25s ease-in',
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
		),
	]),
])

export const goLeftWithConfig = (duration: string) => {
	return trigger('goLeft', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateX(100%)',
			}),
			animate(
				`${duration} ease-in`,
				style({
					opacity: 1,
					transform: 'translateX(0%)',
				}),
			),
		]),
	])
}
