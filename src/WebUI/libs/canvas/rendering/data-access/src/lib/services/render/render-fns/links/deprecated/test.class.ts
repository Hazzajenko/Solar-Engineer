/*
 class CubicBezier {
 public static drawCurve(
 ctx: CanvasRenderingContext2D,
 p1: {
 x: number
 y: number
 },
 p2: {
 x: number
 y: number
 },
 p3: {
 x: number
 y: number
 },
 p4: {
 x: number
 y: number
 },
 ): void {
 const bezier = new BezierSegment(p1, p2, p3, p4) // BezierSegment using the four points
 ctx.moveTo(p1.x, p1.y)
 // Construct the curve out of 100 segments (adjust number for less/more detail)
 for (let t = 0.01; t < 1.01; t += 0.01) {
 const val = bezier.getValue(t) // x,y on the curve for a given t
 ctx.lineTo(val.x, val.y)
 }
 }

 public static curveThroughPoints(
 ctx: CanvasRenderingContext2D,
 points: {
 x: number
 y: number
 }[],
 z = 0.5,
 angleFactor = 0.75,
 moveTo = true,
 ): void {
 const p = [...points] // Local copy of points array
 const duplicates: number[] = [] // Array to hold indices of duplicate points
 // Check to make sure array contains only Points
 for (let i = 0; i < p.length; i++) {
 if (typeof p[i].x !== 'number' || typeof p[i].y !== 'number') {
 throw new Error('Array must contain objects with "x" and "y" properties')
 }
 // Check for the same point twice in a row
 if (i > 0) {
 if (p[i].x === p[i - 1].x && p[i].y === p[i - 1].y) {
 duplicates.push(i) // add index of duplicate to duplicates array
 }
 }
 }
 // Loop through duplicates array and remove points from the points array
 for (let i = duplicates.length - 1; i >= 0; i--) {
 p.splice(duplicates[i], 1)
 }
 // Make sure z is between 0 and 1 (too messy otherwise)
 if (z <= 0) {
 z = 0.5
 } else if (z > 1) {
 z = 1
 }
 // Make sure angleFactor is between 0 and 1
 if (angleFactor < 0) {
 angleFactor = 0
 } else if (angleFactor > 1) {
 angleFactor = 1
 }

 // First calculate all the curve control points

 // None of this junk will do any good if there are only two points
 if (p.length > 2) {
 // Ordinarily, curve calculations will start with the second point and go through the second-to-last point
 let firstPt = 1
 let lastPt = p.length - 1
 // Check if this is a closed line (the first and last points are the same)
 if (p[0].x === p[p.length - 1].x && p[0].y === p[p.length - 1].y) {
 // Include first and last points in curve calculations
 firstPt = 0
 lastPt = p.length
 }

 const controlPts: [Point, Point][] = [] // An array to store the two control points (of a cubic Bézier curve) for each point

 // Loop through all the points (except the first and last if not a closed line) to get curve control points for each.
 for (let i = firstPt; i < lastPt; i++) {
 {
 const p0 = p[i - 1] // Previous point
 const p1 = p[i] // Current point
 const p2 = p[i + 1] // Next point
 const a = Point.distance(p0, p1) // Distance from previous to current point
 const b = Point.distance(p1, p2) // Distance from current to next point
 const c = Point.distance(p0, p2) // Distance from previous to next point

 const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b)) // Angle between the two line segments

 // Calculate control points based on the angle and the z factor
 const controlPt1 = new Point(
 p1.x - (Math.sin(angle) * z * a) / (Math.sin(Math.PI - angle) * 2),
 p1.y + (Math.cos(angle) * z * a) / (Math.sin(Math.PI - angle) * 2),
 )
 const controlPt2 = new Point(
 p1.x + (Math.sin(angle) * z * b) / (Math.sin(Math.PI - angle) * 2),
 p1.y - (Math.cos(angle) * z * b) / (Math.sin(Math.PI - angle) * 2),
 )

 // Calculate the control point distance based on the distance between the current point and the previous point
 const controlPtDistance = Point.distance(p1, p0) * angleFactor

 // Move the control points along the line segments
 const dir = Point.subtract(p0, p2).normalize()
 controlPt1.x += dir.x * controlPtDistance
 controlPt1.y += dir.y * controlPtDistance
 controlPt2.x += dir.x * controlPtDistance
 controlPt2.y += dir.y * controlPtDistance

 controlPts.push([controlPt1, controlPt2])
 }

 //
 // Drawing the curve
 //

 if (moveTo) {
 ctx.moveTo(p[0].x, p[0].y) // Move to the first point
 }

 // Loop through each point and draw the curve segments
 for (let i = 0; i < p.length - 1; i++) {
 const currPt = p[i]
 const nextPt = p[i + 1]
 const controlPtsForCurrPt = controlPts[i] // Control points for the current point

 ctx.bezierCurveTo(
 controlPtsForCurrPt[0].x,
 controlPtsForCurrPt[0].y,
 controlPtsForCurrPt[1].x,
 controlPtsForCurrPt[1].y,
 nextPt.x,
 nextPt.y,
 )
 }
 }
 } else if (p.length === 2) {
 // Only two points, just draw a straight line
 if (moveTo) {
 ctx.moveTo(p[0].x, p[0].y)
 }
 ctx.lineTo(p[1].x, p[1].y)
 }
 }
 }

 class Point {
 constructor(public x: number, public y: number) {}

 static distance(p1: Point, p2: Point): number {
 const dx = p2.x - p1.x
 const dy = p2.y - p1.y
 return Math.sqrt(dx * dx + dy * dy)
 }

 static subtract(p1: Point, p2: Point): Point {
 return new Point(p1.x - p2.x, p1.y - p2.y)
 }

 normalize() {
 const length = Math.sqrt(this.x * this.x + this.y * this.y)
 this.x /= length
 this.y /= length
 return this
 }
 }

 // const points = [new Point(100, 100), new Point(200, 50), new Point(300, 150), new Point(400, 100)]

 // drawCurvedPath(ctx, points, { z: 0.5, moveTo: true, closePath: true, angleFactor: 0.2 })

 function drawCurvedPath(
 ctx: CanvasRenderingContext2D,
 points: Point[],
 options: {
 z?: number
 moveTo?: boolean
 closePath?: boolean
 angleFactor?: number
 } = {},
 ) {
 const { z = 0.5, moveTo = false, closePath = false, angleFactor = 0.2 } = options

 if (points.length >= 2) {
 const controlPts: [Point, Point][] = []

 for (let i = 1, lastPt = points.length - 1; i < lastPt; i++) {
 const p0 = points[i - 1]
 const p1 = points[i]
 const p2 = points[i + 1]

 let a = Point.distance(p0, p1)
 let b = Point.distance(p1, p2)
 let c = Point.distance(p0, p2)

 let angle = Math.acos((a * a + b * b - c * c) / (2 * a * b))

 const controlPt1 = new Point(
 p1.x - (Math.sin(angle) * z * a) / (Math.sin(Math.PI - angle) * 2),
 p1.y + (Math.cos(angle) * z * a) / (Math.sin(Math.PI - angle) * 2),
 )
 const controlPt2 = new Point(
 p1.x + (Math.sin(angle) * z * b) / (Math.sin(Math.PI - angle) * 2),
 p1.y - (Math.cos(angle) * z * b) / (Math.sin(Math.PI - angle) * 2),
 )

 const controlPtDistance = Point.distance(p1, p0) * angleFactor

 const dir = Point.subtract(p0, p2).normalize()
 controlPt1.x += dir.x * controlPtDistance
 controlPt1.y += dir.y * controlPtDistance
 controlPt2.x += dir.x * controlPtDistance
 controlPt2.y += dir.y * controlPtDistance

 controlPts.push([controlPt1, controlPt2])
 }

 if (moveTo) {
 ctx.moveTo(points[0].x, points[0].y)
 }

 for (let i = 0, lastPt = points.length - 1; i < lastPt; i++) {
 const currPt = points[i]
 const nextPt = points[i + 1]
 const controlPtsForCurrPt = controlPts[i]

 ctx.bezierCurveTo(
 controlPtsForCurrPt[0].x,
 controlPtsForCurrPt[0].y,
 controlPtsForCurrPt[1].x,
 controlPtsForCurrPt[1].y,
 nextPt.x,
 nextPt.y,
 )
 }

 if (closePath) {
 ctx.closePath()
 }

 ctx.stroke()
 }
 }

 class BezierSegment {
 constructor(
 public startPoint: Point,
 public controlPoint1: Point,
 public controlPoint2: Point,
 public endPoint: Point,
 ) {}

 draw(ctx: CanvasRenderingContext2D) {
 ctx.bezierCurveTo(
 this.controlPoint1.x,
 this.controlPoint1.y,
 this.controlPoint2.x,
 this.controlPoint2.y,
 this.endPoint.x,
 this.endPoint.y,
 )
 }
 }

 function drawCurvedPathV2(
 ctx: CanvasRenderingContext2D,
 points: Point[],
 options: {
 z?: number
 moveTo?: boolean
 closePath?: boolean
 angleFactor?: number
 } = {},
 ) {
 const { z = 0.5, moveTo = false, closePath = false, angleFactor = 0.2 } = options

 if (points.length >= 2) {
 const segments: BezierSegment[] = []

 for (let i = 1, lastPt = points.length - 1; i < lastPt; i++) {
 const p0 = points[i - 1]
 const p1 = points[i]
 const p2 = points[i + 1]

 let a = Point.distance(p0, p1)
 let b = Point.distance(p1, p2)
 let c = Point.distance(p0, p2)

 let angle = Math.acos((a * a + b * b - c * c) / (2 * a * b))

 const controlPt1 = new Point(
 p1.x - (Math.sin(angle) * z * a) / (Math.sin(Math.PI - angle) * 2),
 p1.y + (Math.cos(angle) * z * a) / (Math.sin(Math.PI - angle) * 2),
 )
 const controlPt2 = new Point(
 p1.x + (Math.sin(angle) * z * b) / (Math.sin(Math.PI - angle) * 2),
 p1.y - (Math.cos(angle) * z * b) / (Math.sin(Math.PI - angle) * 2),
 )

 const controlPtDistance = Point.distance(p1, p0) * angleFactor

 const dir = Point.subtract(p0, p2).normalize()
 controlPt1.x += dir.x * controlPtDistance
 controlPt1.y += dir.y * controlPtDistance
 controlPt2.x += dir.x * controlPtDistance
 controlPt2.y += dir.y * controlPtDistance

 segments.push(new BezierSegment(p1, controlPt1, controlPt2, p2))
 }

 if (moveTo) {
 ctx.moveTo(points[0].x, points[0].y)
 }

 segments.forEach((segment) => segment.draw(ctx))

 if (closePath) {
 ctx.closePath()
 }

 ctx.stroke()
 }
 }
 */
