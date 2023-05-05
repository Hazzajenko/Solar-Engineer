export type CreatePreviewToggle = {
	type: 'CreatePreviewToggle'
}

export const CREATE_PREVIEW_EVENT = {
	CREATE_PREVIEW_TOGGLE: { type: 'CreatePreviewToggle' },
} as const

export type CreatePreviewGraphicsEvent = CreatePreviewToggle

export const CREATE_PREVIEW_XSTATE = {
	CREATE_PREVIEW_ENABLED: 'CreatePreviewEnabled',
	CREATE_PREVIEW_DISABLED: 'CreatePreviewDisabled',
} as const

export type CreatePreviewGraphicsState =
	(typeof CREATE_PREVIEW_XSTATE)[keyof typeof CREATE_PREVIEW_XSTATE]

export const CREATE_PREVIEW_KEY = 'CreatePreview'
