export const STATE_MACHINE = {
	APP: 'APP',
	SELECTED: 'SELECTED',
} as const

export type StateMachine = (typeof STATE_MACHINE)[keyof typeof STATE_MACHINE]
