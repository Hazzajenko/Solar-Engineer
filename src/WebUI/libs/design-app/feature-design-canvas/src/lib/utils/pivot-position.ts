// import { distance } from './vector'
import { Point } from '@shared/data-access/models';


// import { s } from 'vitest/dist/index-5aad25c1'

export const calculatePivotPointPositionForEntities = (
	entities: {
		location: Point
	}[],
) => {
	const totalX = entities.reduce((acc, entity) => acc + entity.location.x, 0)
	const totalY = entities.reduce((acc, entity) => acc + entity.location.y, 0)
	const pivotX = totalX / entities.length
	const pivotY = totalY / entities.length
	return { x: pivotX, y: pivotY } as Point
}

export const calculateBoundsAroundPivotPoint = (
	pivotPoint: Point,
	entities: {
		location: Point
		width: number
		height: number
		angle: number
	}[],
) => {
	const pivotPointX = pivotPoint.x
	const pivotPointY = pivotPoint.y
	const minX = entities.reduce((acc, entity) => {
		const entityLeft = entity.location.x - entity.width / 2
		return entityLeft < acc ? entityLeft : acc // Math.min(acc, entityLeft)
	}, Infinity)
	const minY = entities.reduce((acc, entity) => {
		const entityTop = entity.location.y - entity.height / 2
		return entityTop < acc ? entityTop : acc // Math.min(acc, entityTop)
	}, Infinity)
	const maxX = entities.reduce((acc, entity) => {
		const entityRight = entity.location.x + entity.width / 2
		return entityRight > acc ? entityRight : acc // Math.max(acc, entityRight)
	}, -Infinity)
	const maxY = entities.reduce((acc, entity) => {
		const entityBottom = entity.location.y + entity.height / 2
		return entityBottom > acc ? entityBottom : acc // Math.max(acc, entityBottom)
	}, -Infinity)
	const width = maxX - minX
	const height = maxY - minY
	const angle =
		entities.reduce((acc, entity) => {
			return acc + entity.angle
		}, 0) / entities.length
	return {
		x: pivotPointX,
		y: pivotPointY,
		width,
		height,
		angle,
	}
}

export const calculatePivotPointPositionForPoints = (points: Point[]) => {
	const totalX = points.reduce((acc, point) => acc + point.x, 0)
	const totalY = points.reduce((acc, point) => acc + point.y, 0)
	const pivotX = totalX / points.length
	const pivotY = totalY / points.length
	return { x: pivotX, y: pivotY } as Point
}

export const calculateBoundsAroundPivotPointForPoints = (pivotPoint: Point, points: Point[]) => {
	const pivotPointX = pivotPoint.x
	const pivotPointY = pivotPoint.y
	const minX = points.reduce((acc, point) => {
		return point.x < acc ? point.x : acc // Math.min(acc, point.x)
	}, Infinity)
	const minY = points.reduce((acc, point) => {
		return point.y < acc ? point.y : acc // Math.min(acc, point.y)
	}, Infinity)
	const maxX = points.reduce((acc, point) => {
		return point.x > acc ? point.x : acc // Math.max(acc, point.x)
	}, -Infinity)
	const maxY = points.reduce((acc, point) => {
		return point.y > acc ? point.y : acc // Math.max(acc, point.y)
	}, -Infinity)
	const width = maxX - minX
	const height = maxY - minY
	return {
		x: pivotPointX,
		y: pivotPointY,
		width,
		height,
	}
}

export const calculatePivotPointForPointsAndReturnDistanceAwayFromOrigin = (points: Point[]) => {
	const pivotPoint = calculatePivotPointPositionForPoints(points)
	const distanceFromOrigin = Math.sqrt(pivotPoint.x * pivotPoint.x + pivotPoint.y * pivotPoint.y)
	return { pivotPoint, distanceFromOrigin }
}

export const calculatePivotPointForEntitiesAndReturnDistanceFromEntityToPivotPoint = (
	entities: {
		location: Point
	}[],
) => {
	const pivotPoint = calculatePivotPointPositionForEntities(entities)
	const distancesAwayFromPivot = entities.map((entity) => {
		return Math.sqrt(
			Math.pow(entity.location.x - pivotPoint.x, 2) + Math.pow(entity.location.y - pivotPoint.y, 2),
		)
	})
	return { pivotPoint, distancesAwayFromPivot }
}

export const calculatePivotPointPositionFromPoints = (points: Point[]) => {
	const totalX = points.reduce((acc, point) => acc + point.x, 0)
	const totalY = points.reduce((acc, point) => acc + point.y, 0)
	const pivotX = totalX / points.length
	const pivotY = totalY / points.length
	return { x: pivotX, y: pivotY } as Point
}

export function calculatePivotPositionV7(objects: Point[]) {
	// Find the centroid of the objects
	const centroid = { x: 0, y: 0 }
	for (const obj of objects) {
		centroid.x += obj.x
		centroid.y += obj.y
	}
	centroid.x /= objects.length
	centroid.y /= objects.length

	// Calculate the average distance
	let avgDistance = 0
	for (const obj of objects) {
		avgDistance += distance(obj, centroid)
	}
	avgDistance /= objects.length

	// Calculate the pivot position
	let pivotPosition = { x: centroid.x, y: centroid.y }
	for (const obj of objects) {
		const direction = normalize(subtract(obj, centroid))
		pivotPosition = add(pivotPosition, multiply(direction, avgDistance))
	}

	return pivotPosition
}

function distance(a: Point, b: Point) {
	const dx = a.x - b.x
	const dy = a.y - b.y
	return Math.sqrt(dx * dx + dy * dy)
}

function subtract(a: Point, b: Point) {
	return { x: a.x - b.x, y: a.y - b.y }
}

function normalize(v: Point) {
	const mag = Math.sqrt(v.x * v.x + v.y * v.y)
	return { x: v.x / mag, y: v.y / mag }
}

function multiply(v: Point, s: number) {
	return { x: v.x * s, y: v.y * s }
}

function add(a: Point, b: Point) {
	return { x: a.x + b.x, y: a.y + b.y }
}