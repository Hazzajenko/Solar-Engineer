export const RETURN_OR_CONTINUE = {
	/*			RETURN: Symbol('RETURN'),
	 CONTINUE: Symbol('CONTINUE'),*/
	RETURN: 'RETURN',
	CONTINUE: 'CONTINUE',
} as const

export type ReturnOrContinue = (typeof RETURN_OR_CONTINUE)[keyof typeof RETURN_OR_CONTINUE]

// const wasd: ReturnOrContinue = 'RETURN'
// export const RETURN_OR_CONTINUE = Symbol('RETURN_OR_CONTINUE');
// RETURN_OR_CONTINUE.valueOf()
// export type ReturnOrContinue =
