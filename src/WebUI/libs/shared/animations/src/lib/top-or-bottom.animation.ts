import { animate, style, transition, trigger } from '@angular/animations'

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

export const goBottomWithConfig = (duration: string) => {
	return trigger('goBottom', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateY(-100%)',
			}),
			animate(
				`${duration} ease-in`,
				style({
					opacity: 1,
					transform: 'translateY(0%)',
				}),
			),
		]),
	])
}

export const goTop = trigger('goTop', [
	transition(':enter', [
		style({
			opacity: 0,
			transform: 'translateY(100%)',
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

export const goTopWithConfig = (duration: string) => {
	return trigger('goTop', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateY(100%)',
			}),
			animate(
				`${duration} ease-in`,
				style({
					opacity: 1,
					transform: 'translateY(0%)',
				}),
			),
		]),
	])
}
