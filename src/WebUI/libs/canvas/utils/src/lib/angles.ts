import { AngleDegrees, AngleRadians, Point } from '@shared/data-access/models'

export const addAngles = (angle1: AngleDegrees, angle2: AngleDegrees): AngleDegrees => {
	const sum = angle1 + angle2
	return normalizeAngle(sum) as AngleDegrees
}
export const normalizeAngle = (angle: number): number => {
	if (angle >= 2 * Math.PI) {
		return angle - 2 * Math.PI
	}
	return angle
}
export const toProperAngle = (angle: number): number => {
	return angle % 360
}

export const radianToProperAngle = (radian: number): number => {
	return toProperAngle(radiansToAngle(radian))
}

export const toDegrees = (angle: number): number => {
	return (angle * 180) / Math.PI
}
export const toAngle = (x: number, y: number): AngleDegrees => {
	return ((Math.atan2(y, x) * 180) / Math.PI) as AngleDegrees
}

/*export const normalizeAngle = (angle: number): number => {
 if (angle >= 2 * Math.PI) {
 return angle - 2 * Math.PI
 }
 return angle
 }*/

export const getAngleBetweenTwoPoints = (point1: Point, point2: Point): AngleDegrees => {
	return toAngle(point2.x - point1.x, point2.y - point1.y) as AngleDegrees
	// const angle = toAngle(x2 - x1, y2 - y1)
	// return toProperAngle(angle)
}

export const getAngleInRadiansBetweenTwoPoints = (point1: Point, point2: Point): AngleRadians => {
	return Math.atan2(point2.y - point1.y, point2.x - point1.x) as AngleRadians
}

export const radiansToAngle = (radians: number): AngleDegrees => {
	return ((radians * 180) / Math.PI) as AngleDegrees
}

export const radiansToProperAngle = (radians: number) => {
	// return toProperAngle(radiansToAngle(radians))
}

export const angleToRadians = (angle: AngleDegrees): AngleRadians => {
	return ((angle * Math.PI) / 180) as AngleRadians
}

export const toRadians = (angle: AngleDegrees): AngleRadians => {
	return ((angle * Math.PI) / 180) as AngleRadians
}

export const angleRotate = (
	x: number,
	y: number,
	cx: number,
	cy: number,
	angle: AngleDegrees,
): [number, number] => {
	const radians = toRadians(angle)
	const cos = Math.cos(radians)
	const sin = Math.sin(radians)
	const nx = cos * (x - cx) + sin * (y - cy) + cx
	const ny = cos * (y - cy) - sin * (x - cx) + cy
	return [nx, ny]
}

export function rotateRadian(location: Point, pivotPointer: Point, radians: AngleRadians) {
	// var radians = (Math.PI / 180) * angle,
	const cx = pivotPointer.x
	const cy = pivotPointer.y
	const x = location.x
	const y = location.y
	const cos = Math.cos(radians)
	const sin = Math.sin(radians)
	const nx = cos * (x - cx) + sin * (y - cy) + cx
	const ny = cos * (y - cy) - sin * (x - cx) + cy
	/*  const nx = cos * (x - cx) - sin * (y - cy) + cx
	 const ny = cos * (y - cy) + sin * (x - cx) + cy*/
	return { x: nx, y: ny }
	// return [nx, ny]
}

export function rotateWithAngle(pivotPointer: Point, location: Point, angle: AngleDegrees) {
	const radians = (Math.PI / 180) * angle
	const cx = pivotPointer.x
	const cy = pivotPointer.y
	const x = location.x
	const y = location.y
	const cos = Math.cos(radians)
	const sin = Math.sin(radians)
	const nx = cos * (x - cx) + sin * (y - cy) + cx
	const ny = cos * (y - cy) - sin * (x - cx) + cy
	return { x: nx, y: ny }
	// return [nx, ny]
}

export const rotatePoint = (point: Point, center: Point, angle: AngleDegrees): Point => {
	const [x, y] = angleRotate(point.x, point.y, center.x, center.y, angle)
	return { x, y }
}

export const rotateAOffPivot = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	angle: number,
): [number, number] => [
	(x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
	(x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
]

export const rotateAPointOffPivot = (point: Point, center: Point, angle: number): Point => {
	const [x, y] = rotateAOffPivot(point.x, point.y, center.x, center.y, angle)
	return { x, y }
}

export const rotateOffPivot = (
	x1: number,
	y1: number,
	pivotX: number,
	pivotY: number,
	angle: AngleRadians,
): {
	x: number
	y: number
} => ({
	x: (x1 - pivotX) * Math.cos(angle) - (y1 - pivotY) * Math.sin(angle) + pivotX,
	y: (x1 - pivotX) * Math.sin(angle) + (y1 - pivotY) * Math.cos(angle) + pivotY,
})
export const rotatePointOffPivot = (
	point: Point,
	pivot: Point,
	angle: AngleRadians,
): {
	x: number
	y: number
} => rotateOffPivot(point.x, point.y, pivot.x, pivot.y, angle)

export const adjustXYWithRotation = (
	sides: {
		n?: boolean
		e?: boolean
		s?: boolean
		w?: boolean
	},
	x: number,
	y: number,
	angle: number,
	deltaX1: number,
	deltaY1: number,
	deltaX2: number,
	deltaY2: number,
): [number, number] => {
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	if (sides.e && sides.w) {
		x += deltaX1 + deltaX2
	} else if (sides.e) {
		x += deltaX1 * (1 + cos)
		y += deltaX1 * sin
		x += deltaX2 * (1 - cos)
		y += deltaX2 * -sin
	} else if (sides.w) {
		x += deltaX1 * (1 - cos)
		y += deltaX1 * -sin
		x += deltaX2 * (1 + cos)
		y += deltaX2 * sin
	}

	if (sides.n && sides.s) {
		y += deltaY1 + deltaY2
	} else if (sides.n) {
		x += deltaY1 * sin
		y += deltaY1 * (1 - cos)
		x += deltaY2 * -sin
		y += deltaY2 * (1 + cos)
	} else if (sides.s) {
		x += deltaY1 * -sin
		y += deltaY1 * (1 + cos)
		x += deltaY2 * sin
		y += deltaY2 * (1 - cos)
	}
	return [x, y]
}
