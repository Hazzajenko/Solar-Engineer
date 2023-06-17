import { animate, state, style, transition, trigger } from '@angular/animations'

export const rotate180 = trigger('rotate180', [
	transition(':enter', [
		style({
			transform: 'rotate(180deg)',
		}),
		animate(
			'0.25s ease-in',
			style({
				transform: 'rotate(0deg)',
			}),
		),
	]),
])

export const rotate180BasedOnOpenStateWithConfig = (seconds: number) => {
	return trigger('rotate180', [
		state(
			'open',
			style({
				transform: 'rotate(180deg)',
			}),
		),
		state(
			'closed',
			style({
				transform: 'rotate(0deg)',
			}),
		),
		transition('open <=> closed', [animate(`${seconds}s`)]),
	])
}
