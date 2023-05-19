import { Point } from '@shared/data-access/models'

export function drawCurveV7(
	ctx: CanvasRenderingContext2D,
	ptsa: number[],
	tension = 0.5,
	isClosed?: any,
	numOfSegments?: any,
	showPoints?: boolean,
) {
	showPoints = showPoints ? showPoints : false

	ctx.beginPath()

	drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments))

	if (showPoints) {
		ctx.stroke()
		ctx.beginPath()
		for (let i = 0; i < ptsa.length - 1; i += 2) ctx.rect(ptsa[i] - 2, ptsa[i + 1] - 2, 4, 4)
	}
}

function getCurvePoints(pts: number[], tension = 0.5, isClosed?: any, numOfSegments?: any) {
	// use input value if provided, or use a default value
	tension = typeof tension != 'undefined' ? tension : 0.5
	isClosed = isClosed ? isClosed : false
	numOfSegments = numOfSegments ? numOfSegments : 16
	const res = []
	let _pts = [], // clone array
		x,
		y, // our x,y coords
		t1x,
		t2x,
		t1y,
		t2y, // tension vectors
		c1,
		c2,
		c3,
		c4, // cardinal points
		st,
		t,
		i // steps based on num. of segments

	// clone array so we don't change the original
	//
	_pts = pts.slice(0)

	// The algorithm require a previous and next point to the actual point array.
	// Check if we will draw closed or open curve.
	// If closed, copy end points to beginning and first points to end
	// If open, duplicate first points to befinning, end points to end
	if (isClosed) {
		_pts.unshift(pts[pts.length - 1])
		_pts.unshift(pts[pts.length - 2])
		_pts.unshift(pts[pts.length - 1])
		_pts.unshift(pts[pts.length - 2])
		_pts.push(pts[0])
		_pts.push(pts[1])
	} else {
		_pts.unshift(pts[1]) //copy 1. point and insert at beginning
		_pts.unshift(pts[0])
		_pts.push(pts[pts.length - 2]) //copy last point and append
		_pts.push(pts[pts.length - 1])
	}

	// ok, lets start..

	// 1. loop goes through point array
	// 2. loop goes through each segment between the 2 pts + 1e point before and after
	for (i = 2; i < _pts.length - 4; i += 2) {
		for (t = 0; t <= numOfSegments; t++) {
			// calc tension vectors
			t1x = (_pts[i + 2] - _pts[i - 2]) * tension
			t2x = (_pts[i + 4] - _pts[i]) * tension

			t1y = (_pts[i + 3] - _pts[i - 1]) * tension
			t2y = (_pts[i + 5] - _pts[i + 1]) * tension

			// calc step
			st = t / numOfSegments

			// calc cardinals
			c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1
			c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2)
			c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st
			c4 = Math.pow(st, 3) - Math.pow(st, 2)

			// calc x and y cords with common control vectors
			x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x
			y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y

			//store points in array
			res.push(x)
			res.push(y)
		}
	}

	return res
}

function drawLines(ctx: CanvasRenderingContext2D, pts: number[]) {
	ctx.moveTo(pts[0], pts[1])
	for (let i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1])
}

/*

 if (CanvasRenderingContext2D != 'undefined') {
 CanvasRenderingContext2D.prototype.drawCurve =
 function(pts, tension, isClosed, numOfSegments, showPoints) {
 drawCurve(this, pts, tension, isClosed, numOfSegments, showPoints)}
 }*/

// todo fix
// function drawCurveTest(points, tension) {
// 	ctx.beginPath();
// 	ctx.moveTo(points[0].x, points[0].y);
//
// 	var t = (tension != null) ? tension : 1;
// 	for (var i = 0; i < points.length - 1; i++) {
// 		var p0 = (i > 0) ? points[i - 1] : points[0];
// 		var p1 = points[i];
// 		var p2 = points[i + 1];
// 		var p3 = (i != points.length - 2) ? points[i + 2] : p2;
//
// 		var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
// 		var cp1y = p1.y + (p2.y - p0.y) / 6 * t;
//
// 		var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
// 		var cp2y = p2.y - (p3.y - p1.y) / 6 * t;
//
// 		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
// 	}
// 	ctx.stroke();
// }

function smooth(ctx: CanvasRenderingContext2D, points: Point[]) {
	if (points == undefined || points.length == 0) {
		return true
	}
	if (points.length == 1) {
		ctx.moveTo(points[0].x, points[0].y)
		ctx.lineTo(points[0].x, points[0].y)
		return true
	}
	if (points.length == 2) {
		ctx.moveTo(points[0].x, points[0].y)
		ctx.lineTo(points[1].x, points[1].y)
		return true
	}
	ctx.moveTo(points[0].x, points[0].y)
	let i = 1
	for (i = 1; i < points.length - 2; i++) {
		const xc = (points[i].x + points[i + 1].x) / 2
		const yc = (points[i].y + points[i + 1].y) / 2
		ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
	}
	ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
	return true
}

/*for (let i = 1; i < data.length; i++) {
 this.context.bezierCurveTo(
 data[i - 1].x + (data[i].x - data[i - 1].x) / 2,
 data[i - 1].y,
 data[i - 1].x + (data[i].x - data[i - 1].x) / 2,
 data[i].y,
 data[i].x,
 data[i].y,
 )
 }*/

/*
 const drawPointsWithCurvedCorners = (ctx: CanvasRenderingContext2D, points: Point[]) => {
 for (let n = 0; n <= points.length - 1; n++) {
 let pointA = points[n]
 let pointB = points[(n + 1) % points.length]
 let pointC = points[(n + 2) % points.length]

 const midPointAB = {
 x: pointA.x + (pointB.x - pointA.x) / 2,
 y: pointA.y + (pointB.y - pointA.y) / 2,
 }
 const midPointBC = {
 x: pointB.x + (pointC.x - pointB.x) / 2,
 y: pointB.y + (pointC.y - pointB.y) / 2,
 }
 ctx.moveTo(midPointAB.x, midPointAB.y)
 ctx.arcTo(pointB.x, pointB.y, midPointBC.x, midPointBC.y, radii[pointB.r])
 ctx.lineTo(midPointBC.x, midPointBC.y)
 }
 }
 */

function drawCurveV3(
	ctx: CanvasRenderingContext2D,
	points: {
		x: number
		y: number
	}[],
	tension = 2,
) {
	if (points.length < 2) {
		return
	}
	ctx.beginPath()
	if (points.length === 2) {
		ctx.moveTo(points[0].x, points[0].y)
		ctx.lineTo(points[1].x, points[1].y)
		ctx.stroke()
		return
	}
	let prevM2x = 0
	let prevM2y = 0
	for (let i = 1, len = points.length; i < len - 1; ++i) {
		const p0 = points[i - 1]
		const p1 = points[i]
		const p2 = points[i + 1]
		let tx = p2.x - (i === 1 ? p0.x : prevM2x)
		let ty = p2.y - (i === 1 ? p0.y : prevM2y)
		const tLen = Math.sqrt(tx ** 2 + ty ** 2)
		if (tLen > 1e-8) {
			const inv = 1 / tLen
			tx *= inv
			ty *= inv
		} else {
			tx = 0
			ty = 0
		}
		const det =
			Math.sqrt(
				Math.min((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2, (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2),
			) /
			(2 * tension)
		const m1x = p1.x - tx * det
		const m1y = p1.y - ty * det
		const m2x = p1.x + tx * det
		const m2y = p1.y + ty * det
		if (i === 1) {
			ctx.moveTo(p0.x, p0.y)
			ctx.quadraticCurveTo(m1x, m1y, p1.x, p1.y)
		} else {
			const mx = (prevM2x + m1x) / 2
			const my = (prevM2y + m1y) / 2
			ctx.quadraticCurveTo(prevM2x, prevM2y, mx, my)
			ctx.quadraticCurveTo(m1x, m1y, p1.x, p1.y)
		}
		if (i === len - 2) {
			ctx.quadraticCurveTo(m2x, m2y, p2.x, p2.y)
		}
		prevM2x = m2x
		prevM2y = m2y
	}
	ctx.stroke()
}
