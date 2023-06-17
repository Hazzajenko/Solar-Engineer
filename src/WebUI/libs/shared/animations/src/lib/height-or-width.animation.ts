import { animate, state, style, transition, trigger } from '@angular/animations'

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

export const expandCollapse = trigger('expandCollapse', [
	state(
		'void, collapsed',
		style({
			height: '0',
		}),
	),

	state('*, expanded', style('*')),

	// Prevent the transition if the state is false
	transition('void <=> false, collapsed <=> false, expanded <=> false', []),

	// Transition
	transition('void <=> *, collapsed <=> expanded', animate('{{timings}}'), {
		params: {
			timings: `225ms cubic-bezier(0.0, 0.0, 0.2, 1)`,
		},
	}),
])

export const heightInOutV2 = trigger('heightInOutV2', [
	transition(':enter', [
		style({
			height: 0,
		}),
		animate(`225ms cubic-bezier(0.0, 0.0, 0.2, 1)`, style('*')),
	]),
	transition(':leave', [
		style({
			height: '*',
		}),
		animate(`225ms cubic-bezier(0.0, 0.0, 0.2, 1)`, style({ height: 0 })),
	]),
])
