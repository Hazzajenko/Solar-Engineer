export const CTX_TASK = {
	SELECTION_BOX: 'SELECTION_BOX',
	CREATION_BOX: 'CREATION_BOX',
} as const

export type CtxTask = (typeof CTX_TASK)[keyof typeof CTX_TASK]
