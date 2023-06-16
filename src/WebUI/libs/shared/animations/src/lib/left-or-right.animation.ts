import { animate, state, style, transition, trigger } from '@angular/animations'

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

export const goLeftWithConfig = (duration: number) => {
	return trigger('goLeft', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateX(100%)',
			}),
			animate(
				`${duration}s ease-in`,
				style({
					opacity: 1,
					transform: 'translateX(0%)',
				}),
			),
		]),
	])
}

export const inRightLeaveLeftWithConfig = (seconds: number) => {
	return trigger('inRightLeaveLeft', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateX(100%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 1,
					transform: 'translateX(0%)',
				}),
			),
		]),
		transition(':leave', [
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 0,
					transform: 'translateX(-100%)',
				}),
			),
		]),
	])
}

export const inLeftLeaveRightWithConfig = (seconds: number) => {
	return trigger('inLeftLeaveRight', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateX(-100%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 1,
					transform: 'translateX(0%)',
				}),
			),
		]),
		transition(':leave', [
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 0,
					transform: 'translateX(100%)',
				}),
			),
		]),
	])
}

export const inLeftLeaveLeftWithConfigV2 = (seconds: number) => {
	return trigger('inLeftLeaveLeftV2', [
		state(
			'in',
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
		),
		state(
			'out',
			style({
				opacity: 0,
				transform: 'translateX(-100%)',
			}),
		),
		transition('in <=> void', [animate(`${seconds}s`)]),
	])
}

export const inLeftLeaveLeftWithConfig = (seconds: number) => {
	return trigger('inLeftLeaveLeft', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateX(-100%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 1,
					transform: 'translateX(0%)',
				}),
			),
		]),
		transition(':leave', [
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 0,
					transform: 'translateX(-100%)',
				}),
			),
		]),
	])
}

export const inRightLeaveRightWithConfig = (seconds: number) => {
	return trigger('inRightLeaveRight', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateX(100%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 1,
					transform: 'translateX(0%)',
				}),
			),
		]),
		transition(':leave', [
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 0,
					transform: 'translateX(100%)',
				}),
			),
		]),
	])
}

export const leaveLeftWithConfig = (seconds: number) => {
	return trigger('leaveLeft', [
		transition(':leave', [
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 0,
					transform: 'translateX(-100%)',
				}),
			),
		]),
	])
}

export const rightToLeftInOutWithConfig = (seconds: number) => {
	return trigger('rightToLeft', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateX(100%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 1,
					transform: 'translateX(0%)',
				}),
			),
		]),
		transition(':leave', [
			style({
				opacity: 1,
				transform: 'translateX(0%)',
			}),
			animate(
				`${seconds}s ease-in`,
				style({
					opacity: 0,
					transform: 'translateX(-100%)',
				}),
			),
		]),
	])
}
