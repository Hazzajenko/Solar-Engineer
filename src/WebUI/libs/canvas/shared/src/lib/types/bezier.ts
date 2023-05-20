import { Point } from '@shared/data-access/models'

export type DrawPointX = number
export type DrawPointY = number
export type DrawPoint = Readonly<[DrawPointX, DrawPointY]>
export type DrawPoints = Readonly<DrawPoint[]>
export type ControlPointX = number
export type ControlPointY = number
export type BezierNumberLine = Readonly<
	[
		DrawPointX,
		DrawPointY,
		ControlPointX,
		ControlPointY,
		ControlPointX,
		ControlPointY,
		DrawPointX,
		DrawPointY,
	]
>

export type APointDrawPoint = Readonly<[DrawPointX, DrawPointY]>
export type APointControlPoint = Readonly<[ControlPointX, ControlPointY]>
export type BezierAPointLine = [
	APointDrawPoint,
	APointControlPoint,
	APointControlPoint,
	APointDrawPoint,
]

export type BezierXyPointLine = Readonly<[Point, Point, Point, Point]>

export type QuadraticBezierXyPointLine = Readonly<[Point, Point, Point]>

export type QuadraticBezierNumberLine = Readonly<
	[DrawPointX, DrawPointY, ControlPointX, ControlPointY, DrawPointX, DrawPointY]
>

export type QuadraticBezierAPointLine = [APointDrawPoint, APointControlPoint, APointDrawPoint]

export type APointLineToLine = [APointDrawPoint, APointDrawPoint]

export type LineToLineNumberLine = Readonly<[DrawPointX, DrawPointY, DrawPointX, DrawPointY]>

export type CurvedLine = APointLineToLine | BezierAPointLine | QuadraticBezierAPointLine

export type CurvedNumberLine = BezierNumberLine | QuadraticBezierNumberLine | LineToLineNumberLine
