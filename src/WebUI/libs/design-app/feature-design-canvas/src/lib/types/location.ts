import { Point } from '@shared/data-access/models'

export type MiddlePoint = {
	middleX: number
	middleY: number
}

export type EventPoint = Point & {
	_type: 'EventPoint'
}

export type TransformedPoint = DOMPoint & {
	_type: 'TransformedPoint'
}

export type TransformedPointToDragOffset = Omit<TransformedPoint, '_type'> & {
	_type: 'TransformedPointToDragOffset'
}

export type XyOrTransformedPoint = Point | TransformedPoint

export function isTransformedPoint(point: { x: number; y: number }): point is TransformedPoint {
	return (point as TransformedPoint)._type === 'TransformedPoint'
}

export function isTransformedPointToDragOffset(
	point: Point,
): point is TransformedPointToDragOffset {
	return (point as TransformedPointToDragOffset)._type === 'TransformedPointToDragOffset'
}