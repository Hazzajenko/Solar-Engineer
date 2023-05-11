import { NEARBY_LINES_STATE } from '@design-app/data-access'

export const NEARBY_GRAPHICS_EVENT = {
	NEARBY_LINES_TOGGLE: { type: 'NearbyLinesToggle' },
	SELECT_CENTER_LINE_SCREEN_SIZE: { type: 'SelectCenterLineScreenSize' },
	SELECT_TWO_SIDE_AXIS_LINES: { type: 'SelectTwoSideAxisLines' },
	SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES: { type: 'SelectCenterLineBetweenTwoEntities' },
} as const
export const NEARBY_GRAPHICS_STATE_MODE = {
	CENTER_LINE_BETWEEN_TWO_ENTITIES: 'CENTER_LINE_BETWEEN_TWO_ENTITIES',
	CENTER_LINE_SCREEN_SIZE: 'CENTER_LINE_SCREEN_SIZE',
	TWO_SIDE_AXIS_LINES: 'TWO_SIDE_AXIS_LINES',
} as const
export const NearbyGraphicsMenuOptions = [
	{
		label: 'Center Line Between Two Entities',
		value: NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES,
		event: NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES,
	},
	{
		label: 'Center Line Screen Size',
		value: NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE,
		event: NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_SCREEN_SIZE,
	},
	{
		label: 'Two Side Axis Lines',
		value: NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES,
		event: NEARBY_GRAPHICS_EVENT.SELECT_TWO_SIDE_AXIS_LINES,
	},
] as const
