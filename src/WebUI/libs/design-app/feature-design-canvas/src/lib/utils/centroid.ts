import { Point } from '@shared/data-access/models'

export const getPolygonCentroid = (vertices: Point[]): Point => {
	const centroid: {
		y: number
		x: number
	} = { y: 0, x: 0 }
	const vertexCount: number = vertices.length

	let area = 0
	let x0 = 0 // Current vertex X
	let y0 = 0 // Current vertex Y
	let x1 = 0 // Next vertex X
	let y1 = 0 // Next vertex Y
	let a = 0 // Partial signed area
	let i = 0 // Counter

	for (; i < vertexCount - 1; ++i) {
		x0 = vertices[i].x
		y0 = vertices[i].y
		x1 = vertices[i + 1].x
		y1 = vertices[i + 1].y

		a = x0 * y1 - x1 * y0

		area += a

		centroid.x += (x0 + x1) * a
		centroid.y += (y0 + y1) * a
	}

	// Do last vertex separately to avoid performing an expensive
	// modulus operation in each iteration.
	x0 = vertices[i].x
	y0 = vertices[i].y
	x1 = vertices[0].x
	y1 = vertices[0].y

	a = x0 * y1 - x1 * y0

	area += a
	centroid.x += (x0 + x1) * a
	centroid.y += (y0 + y1) * a
	area *= 0.5

	centroid.x /= 6 * area
	centroid.y /= 6 * area

	return centroid
}

export const get_polygon_centroid = (pts: Point[]) => {
	const first = pts[0],
		last = pts[pts.length - 1]
	const nPts = pts.length
	if (first.x != last.x || first.y != last.y) pts.push(first)
	let twicearea = 0,
		x = 0,
		y = 0, // eslint-disable-next-line prefer-const
		p1: {
			x: number
			y: number
		},
		p2: {
			y: number
			x: number
		},
		f: number
	for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
		p1 = pts[i]
		p2 = pts[j]
		f = p1.x * p2.y - p2.x * p1.y
		twicearea += f
		x += (p1.x + p2.x) * f
		y += (p1.y + p2.y) * f
	}
	f = twicearea * 3
	return { x: x / f, y: y / f }
}

export const get_polygon_centroid_v2 = (pts: Point[]) => {
	const first = pts[0],
		last = pts[pts.length - 1]
	const nPts = pts.length
	if (first.x != last.x || first.y != last.y) pts.push(first)
	let twicearea = 0,
		x = 0,
		y = 0,
		p1,
		p2,
		f
	for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
		p1 = pts[i]
		p2 = pts[j]
		f = (p1.y - first.y) * (p2.x - first.x) - (p2.y - first.y) * (p1.x - first.x)
		twicearea += f
		x += (p1.x + p2.x - 2 * first.x) * f
		y += (p1.y + p2.y - 2 * first.y) * f
	}
	f = twicearea * 3
	return { x: x / f + first.x, y: y / f + first.y }
}

export const getPolygonCentroidV32 = (points: Point[]) => {
	const centroid = { x: 0, y: 0 }
	for (let i = 0; i < points.length; i++) {
		const point = points[i]
		centroid.x += point.x
		centroid.y += point.y
	}
	centroid.x /= points.length
	centroid.y /= points.length
	return centroid
}