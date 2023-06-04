import { animate, state, style, transition, trigger } from '@angular/animations'

export const visibleHidden = trigger('visibleHidden', [
	state(
		'visible',
		style({
			opacity: 1,
			transform: 'translate(-50%, 0%) scale(1)',
		}),
	),
	state(
		'void, hidden',
		style({
			opacity: 0,
			transform: 'translate(-50%, 0%) scale(0.95)',
		}),
	),
	transition('* => visible', animate('500ms')),
	transition('* => void, * => hidden', animate('250ms')),

	// transition('visible <=> void, visible <=> hidden', animate('0.1s ease-in')),
	// transition('visible <=> hidden', animate('0.1s ease-in')),
])
