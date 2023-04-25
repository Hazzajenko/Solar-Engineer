export type NearbyLinesToggle = {
	type: 'NearbyLinesToggle'
}

export type SelectCenterLineScreenSize = {
	type: 'SelectCenterLineScreenSize'
}

export type SelectTwoSideAxisLines = {
	type: 'SelectTwoSideAxisLines'
}

export type SelectCenterLineBetweenTwoEntities = {
	type: 'SelectCenterLineBetweenTwoEntities'
}

/*export class SelectCenterLineScreenSize {
 readonly type = 'SelectCenterLineScreenSize'
 readonly payload = null
 }

 export class SelectTwoSideAxisLines {
 readonly type = 'SelectTwoSideAxisLines'
 readonly payload = null
 }

 export class SelectCenterLineBetweenTwoEntities {
 readonly type = 'SelectCenterLineBetweenTwoEntities'
 readonly payload = null
 }*/

export const NEARBY_GRAPHICS_EVENT_TYPE = {
	SELECT_CENTER_LINE_SCREEN_SIZE: 'SelectCenterLineScreenSize',
	SELECT_TWO_SIDE_AXIS_LINES: 'SelectTwoSideAxisLines',
	SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES: 'SelectCenterLineBetweenTwoEntities',
} as const

export const NEARBY_GRAPHICS_EVENT = {
	NEARBY_LINES_TOGGLE: { type: 'NearbyLinesToggle' },
	SELECT_CENTER_LINE_SCREEN_SIZE: { type: 'SelectCenterLineScreenSize' },
	SELECT_TWO_SIDE_AXIS_LINES: { type: 'SelectTwoSideAxisLines' },
	SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES: { type: 'SelectCenterLineBetweenTwoEntities' },
} as const

export type NearbyGraphicsEventType =
	(typeof NEARBY_GRAPHICS_EVENT_TYPE)[keyof typeof NEARBY_GRAPHICS_EVENT_TYPE]

export type NearbyGraphicsEvent =
	| NearbyLinesToggle
	| SelectCenterLineScreenSize
	| SelectTwoSideAxisLines
	| SelectCenterLineBetweenTwoEntities

// CenterLineBetweenTwoEntities
// CenterLineScreenSize
// TwoSideAxisLines

export const NEARBY_GRAPHICS_STATE = {
	NEARBY_LINES_ENABLED: 'NearbyLinesEnabled',
	NEARBY_LINES_DISABLED: 'NearbyLinesDisabled',
	CENTER_LINE_BETWEEN_TWO_ENTITIES: 'CenterLineBetweenTwoEntities',
	CENTER_LINE_SCREEN_SIZE: 'CenterLineScreenSize',
	TWO_SIDE_AXIS_LINES: 'TwoSideAxisLines',
} as const

export type NearbyGraphicsState = (typeof NEARBY_GRAPHICS_STATE)[keyof typeof NEARBY_GRAPHICS_STATE]
