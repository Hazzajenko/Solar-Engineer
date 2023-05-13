import { Axis } from '../types'
import { EntityBounds } from './entity-bounds'

export const SAME_AXIS_POSITION = {
	TOP: 'top' as const,
	BOTTOM: 'bottom' as const,
	LEFT: 'left' as const,
	RIGHT: 'right' as const,
} as const

export type SameAxisPosition = (typeof SAME_AXIS_POSITION)[keyof typeof SAME_AXIS_POSITION]
export const isObjectAboveOrBelow = (obj1: EntityBounds, obj2: EntityBounds, axis: Axis) => {
	if (axis === 'x') {
		return obj1.top > obj2.bottom || obj1.bottom < obj2.top
	}
	return obj1.left > obj2.right || obj1.right < obj2.left
}

export const getSameAxisPosition = (
	start: EntityBounds,
	end: EntityBounds,
	axis: Axis,
): SameAxisPosition | undefined => {
	if (axis === 'x') {
		if (start.centerY > end.centerY) {
			return SAME_AXIS_POSITION.TOP
		}
		if (start.centerY < end.centerY) {
			return SAME_AXIS_POSITION.BOTTOM
		}
	}
	if (axis === 'y') {
		if (start.centerX > end.centerX) {
			return SAME_AXIS_POSITION.LEFT
		}
		if (start.centerX < end.centerX) {
			return SAME_AXIS_POSITION.RIGHT
		}
	}
	return undefined
}

export const getOppositeSameAxisPosition = (axisPos: SameAxisPosition): SameAxisPosition => {
	switch (axisPos) {
		case SAME_AXIS_POSITION.TOP:
			return SAME_AXIS_POSITION.BOTTOM
		case SAME_AXIS_POSITION.BOTTOM:
			return SAME_AXIS_POSITION.TOP
		case SAME_AXIS_POSITION.LEFT:
			return SAME_AXIS_POSITION.RIGHT
		case SAME_AXIS_POSITION.RIGHT:
			return SAME_AXIS_POSITION.LEFT
	}
}

/*
 export const getCornerPointsFromAxisPosition = (
 axisPos: SameAxisPosition,
 bounds: EntityBounds,
 ): { a: { x: number; y: number }; b: { x: number; y: number } } => {
 const { left, right, top, bottom } = bounds
 switch (axisPos) {
 case SAME_AXIS_POSITION.TOP: {
 return {
 a: { x: left, y: top },
 b: { x: right, y: top },
 }
 }
 case SAME_AXIS_POSITION.BOTTOM: {
 return {
 a: { x: left, y: bottom },
 b: { x: right, y: bottom },
 }
 }
 case SAME_AXIS_POSITION.LEFT: {
 return {
 a: { x: left, y: top },
 b: { x: left, y: bottom },
 }
 }
 case SAME_AXIS_POSITION.RIGHT: {
 return {
 a: { x: right, y: top },
 b: { x: right, y: bottom },
 }
 }
 }
 }*/
