import { animate, state, style, transition, trigger } from '@angular/animations'

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
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
])

export const fadeInFadeOutWithConfig = (seconds: number) => {
	return trigger('fadeInFadeOut', [
		transition(':enter', [
			style({
				opacity: 0,
			}),
			animate(
				`${seconds}s ease-in`,
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
				`${seconds}s ease-in`,
				style({
					opacity: 0,
				}),
			),
		]),
	])
}
