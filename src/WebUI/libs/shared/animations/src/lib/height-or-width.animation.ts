import { animate, style, transition, trigger } from '@angular/animations'

export const increaseHeight = trigger('increaseHeight', [
	transition(':enter', [
		style({
			height: 0,
			opacity: 0,
		}),
		animate(
			'0.25s ease-in',
			style({
				height: '*',
				opacity: 1,
			}),
		),
	]),
])

export const heightInOutWithConfig = (seconds: number) => {
	return trigger('heightInOut', [
		transition(':enter', [
			style({
				height: 0,
				opacity: 0,
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					height: '*',
					opacity: 1,
				}),
			),
		]),
		transition(':leave', [
			style({
				height: '*',
				opacity: 1,
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					height: 0,
					opacity: 0,
				}),
			),
		]),
	])
}

export const heightInOut = trigger('heightInOut', [
	transition(':enter', [
		style({
			height: 0,
			opacity: 0,
		}),
		animate(
			'0.25s ease-in',
			style({
				height: '*',
				opacity: 1,
			}),
		),
	]),
	transition(':leave', [
		style({
			height: '*',
			opacity: 1,
		}),
		animate(
			'0.25s ease-in',
			style({
				height: 0,
				opacity: 0,
			}),
		),
	]),
])
