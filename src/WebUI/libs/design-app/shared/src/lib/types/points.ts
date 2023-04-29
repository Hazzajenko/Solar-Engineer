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

export type EventWithOffsets = {
	offsetX: number
	offsetY: number
}