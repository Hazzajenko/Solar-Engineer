import { Point } from '@shared/data-access/models'

export const isPointOnLine = (point: Point, linePoints: Point[]): boolean => {
	for (let i = 0; i < linePoints.length - 1; i++) {
		const p1 = linePoints[i]
		const p2 = linePoints[i + 1]
		const distanceToLine = getDistanceToLine(point, p1, p2)
		if (distanceToLine <= 1) {
			return true
		}
	}
	return false
}

const getDistanceToLine = (point: Point, lineStart: Point, lineEnd: Point): number => {
	const numerator = Math.abs(
		(lineEnd.y - lineStart.y) * point.x -
			(lineEnd.x - lineStart.x) * point.y +
			lineEnd.x * lineStart.y -
			lineEnd.y * lineStart.x,
	)
	const denominator = Math.sqrt((lineEnd.y - lineStart.y) ** 2 + (lineEnd.x - lineStart.x) ** 2)
	return numerator / denominator
}
