import { Point, Size } from '@shared/data-access/models'

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
export const getTopLeftPointFromTransformedPoint = (
	point: TransformedPoint,
	size: Size,
): TransformedPoint => {
	return {
		x: point.x - size.width / 2,
		y: point.y - size.height / 2,
	} as TransformedPoint
}