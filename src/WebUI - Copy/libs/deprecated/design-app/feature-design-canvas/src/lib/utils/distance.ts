import { Point } from '@shared/data-access/models'

export const getDistanceBetweenPoints = (p1: Point, p2: Point) => {
	const a = p1.x - p2.x
	const b = p1.y - p2.y
	return Math.sqrt(a * a + b * b)
}

export const getAverageDistanceBetweenPointAndPoints = (point: Point, points: Point[]) => {
	const distances = points.map((p) => getDistanceBetweenPoints(point, p))
	const sum = distances.reduce((acc, distance) => acc + distance, 0)
	return sum / distances.length
}

export const getXAndYDistanceBetweenPoints = (p1: Point, p2: Point) => {
	const x = p1.x - p2.x
	const y = p1.y - p2.y
	return { x, y }
}
