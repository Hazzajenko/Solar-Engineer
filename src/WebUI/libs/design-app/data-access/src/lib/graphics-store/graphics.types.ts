export const CREATE_PREVIEW_STATE = {
	CREATE_PREVIEW_DISABLED: 'CreatePreviewDisabled',
	CREATE_PREVIEW_ENABLED: 'CreatePreviewEnabled',
} as const

export type CreatePreviewState = (typeof CREATE_PREVIEW_STATE)[keyof typeof CREATE_PREVIEW_STATE]

export const NEARBY_LINES_STATE = {
	NEARBY_LINES_DISABLED: 'NearbyLinesDisabled',
	CENTER_LINE_BETWEEN_TWO_ENTITIES: 'CenterLineBetweenTwoEntities',
	CENTER_LINE_SCREEN_SIZE: 'CenterLineScreenSize',
	TWO_SIDE_AXIS_LINES: 'TwoSideAxisLines',
} as const

export type NearbyLinesState = (typeof NEARBY_LINES_STATE)[keyof typeof NEARBY_LINES_STATE]
