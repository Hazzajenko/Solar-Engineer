import { animate, style, transition, trigger } from '@angular/animations'

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
