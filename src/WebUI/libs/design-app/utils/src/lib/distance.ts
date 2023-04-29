import { Point } from '@shared/data-access/models'

const distance2d = (x1: number, y1: number, x2: number, y2: number) => {
	const xd = x2 - x1
	const yd = y2 - y1
	return Math.hypot(xd, yd)
}
export const getDistanceBetweenTwoPoints = (point1: Point, point2: Point) => {
	return distance2d(point1.x, point1.y, point2.x, point2.y)
}