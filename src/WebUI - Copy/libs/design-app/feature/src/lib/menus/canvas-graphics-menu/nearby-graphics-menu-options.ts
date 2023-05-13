import { NEARBY_GRAPHICS_STATE_MODE } from '@design-app/data-access'
import { NEARBY_GRAPHICS_EVENT } from 'deprecated/design-app/feature-design-canvas'

export const NearbyGraphicsMenuOptions = [
	{
		label: 'Center Line Between Two Entities',
		value: NEARBY_GRAPHICS_STATE_MODE.CENTER_LINE_BETWEEN_TWO_ENTITIES,
		event: NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_BETWEEN_TWO_ENTITIES,
	},
	{
		label: 'Center Line Screen Size',
		value: NEARBY_GRAPHICS_STATE_MODE.CENTER_LINE_SCREEN_SIZE,
		event: NEARBY_GRAPHICS_EVENT.SELECT_CENTER_LINE_SCREEN_SIZE,
	},
	{
		label: 'Two Side Axis Lines',
		value: NEARBY_GRAPHICS_STATE_MODE.TWO_SIDE_AXIS_LINES,
		event: NEARBY_GRAPHICS_EVENT.SELECT_TWO_SIDE_AXIS_LINES,
	},
] as const
