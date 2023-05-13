import { AngleRadians } from './angles'

export type EntityBounds = {
	left: number
	top: number
	right: number
	bottom: number
	centerX: number
	centerY: number
}

export type CompleteEntityBounds = EntityBounds & {
	width: number
	height: number
}

export type TrigonometricBounds = CompleteEntityBounds & {
	angle: AngleRadians
}

/**
 * @description
 * [minX, minY, maxX, maxY]
 * [left, top, right, bottom]
 */
export type TrigonometricBoundsTuple = [number, number, number, number]