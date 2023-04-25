import { Axis } from '../../../types'
import { CompleteEntityBounds, EntityBounds } from '../../../utils'

export type GridStateDeprecated = {
	showGrid: boolean
	showAxis: boolean
	showRuler: boolean
	currentAxis: Axis | undefined
	xAxisLineBounds: EntityBounds | undefined
	yAxisLineBounds: EntityBounds | undefined
	axisPreviewRect: CompleteEntityBounds | undefined
}

export const InitialGridStateDeprecated: GridStateDeprecated = {
	showGrid: true,
	showAxis: true,
	showRuler: true,
	currentAxis: undefined,
	xAxisLineBounds: undefined,
	yAxisLineBounds: undefined,
	axisPreviewRect: undefined,
}