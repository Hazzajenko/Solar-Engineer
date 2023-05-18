import { CanvasEntity, PanelLinkModel } from '@entities/shared'
import { getSymbolLocationBasedOnIndex } from '../../render.service'
import { PanelLinksStore } from '@entities/data-access'
import { Point } from '@shared/data-access/models'
import { drawSplines } from './draw-splines'

export const drawLinkModePathLines = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	linksInOrder: PanelLinkModel[],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!linksInOrder.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	linksInOrder.forEach((link) => {
		ctx.save()
		ctx.beginPath()

		if (selectedPanelLinkId === link.id) {
			ctx.strokeStyle = 'red'
			ctx.lineWidth = 2
		}

		if (hoveringOverPanelLinkInLinkMenu?.panelLinkId === link.id) {
			ctx.strokeStyle = 'red'
			ctx.lineWidth = 2
		}
		link.linePoints.forEach((linePoint, index) => {
			const drawFn = index === 0 ? ctx.moveTo : ctx.lineTo
			const currentPanelId = index === 0 ? link.positivePanelId : link.negativePanelId
			const point = customIds.includes(currentPanelId)
				? getSymbolLocationBasedOnIndex(index, customEntities, currentPanelId)
				: linePoint
			drawFn.call(ctx, point.x, point.y)
		})

		ctx.stroke()
		ctx.restore()
	})
	ctx.restore()
}

export const drawLinkModePathLinesCurved = (
	ctx: CanvasRenderingContext2D,
	customEntities: CanvasEntity[] | undefined,
	linksInOrder: PanelLinkModel[],
	selectedPanelLinkId: string | undefined,
	hoveringOverPanelLinkInLinkMenu: PanelLinksStore['hoveringOverPanelLinkInLinkMenu'],
) => {
	const customIds = customEntities?.map((entity) => entity.id) ?? []
	if (!linksInOrder.length) {
		return
	}
	ctx.save()
	ctx.strokeStyle = 'black'
	ctx.lineWidth = 1

	const pointsMappedToCenter = linksInOrder.map((link) => {
		const firstPoint = link.linePoints[0]
		const lastPoint = link.linePoints[1]
		const centerPoint = {
			x: (firstPoint.x + lastPoint.x) / 2,
			y: (firstPoint.y + lastPoint.y) / 2,
		}
		return centerPoint
	})

	const flattenPointsToNumberArrayV2 = pointsMappedToCenter.reduce((acc, point) => {
		return [...acc, point.x, point.y]
	}, [] as number[])

	drawSplines(ctx, flattenPointsToNumberArrayV2)

	/*const flattenPointsToNumberArray = pointsMappedToCenter.reduce((acc, point) => {
	 return Array.isArray(acc) ? [...acc, point.x, point.y] : [acc, point.x, point.y]
	 }, [] as number[])*/

	/*const pointsMappedToCenter = linksInOrder.map((link) => {
	 const firstPoint = link.linePoints[0]
	 const lastPoint = link.linePoints[1]
	 const centerPoint = {
	 x: (firstPoint.x + lastPoint.x) / 2,
	 y: (firstPoint.y + lastPoint.y) / 2,
	 }
	 return {
	 ...link,
	 centerPoint,
	 }
	 })
	 console.log(pointsMappedToCenter)
	 const pointsMappedToCenterToPoints = pointsMappedToCenter.map((link) => {
	 return link.centerPoint
	 })
	 console.log(pointsMappedToCenterToPoints)

	 if (!pointsMappedToCenterToPoints.length) {
	 return
	 }

	 if (pointsMappedToCenterToPoints.length < 3) {
	 return
	 }

	 ctx.moveTo(pointsMappedToCenterToPoints[0].x, pointsMappedToCenterToPoints[0].y)

	 for (let i = 1; i < pointsMappedToCenterToPoints.length - 2; i++) {
	 const xc = (pointsMappedToCenterToPoints[i].x + pointsMappedToCenterToPoints[i + 1].x) / 2
	 const yc = (pointsMappedToCenterToPoints[i].y + pointsMappedToCenterToPoints[i + 1].y) / 2
	 ctx.quadraticCurveTo(
	 pointsMappedToCenterToPoints[i].x,
	 pointsMappedToCenterToPoints[i].y,
	 xc,
	 yc,
	 )
	 }

	 // curve through the last two points
	 ctx.quadraticCurveTo(
	 pointsMappedToCenterToPoints[pointsMappedToCenterToPoints.length - 2].x,
	 pointsMappedToCenterToPoints[pointsMappedToCenterToPoints.length - 2].y,
	 pointsMappedToCenterToPoints[pointsMappedToCenterToPoints.length - 1].x,
	 pointsMappedToCenterToPoints[pointsMappedToCenterToPoints.length - 1].y,
	 )
	 ctx.stroke()*/

	/*	const allCenterPoints = pointsMappedToCenter.reduce((acc, link) => {
	 return [...acc, link.centerPoint]
	 }, [] as Point[])*/
	// const allCenterPoints
	// }

	/*	const pointsMappedToCenterWithCurvature = pointsMappedToCenter.map((link) => {
	 const firstPoint = link.linePoints[0]
	 const lastPoint = link.linePoints[link.linePoints.length - 1]
	 const centerPoint = link.centerPoint
	 const curvature = Math.abs((firstPoint.y - lastPoint.y) / (firstPoint.x - lastPoint.x))
	 return {
	 ...link,
	 curvature,
	 }
	 })*/

	/*	const allPoints = linksInOrder.reduce((acc, link) => {
	 return [...acc, ...link.linePoints]
	 }, [] as Point[])*/
	/*	const maxDistance = allPoints.reduce((acc, point, index) => {
	 if (index === 0) {
	 return acc
	 }
	 const previousPoint = allPoints[index - 1]
	 const distance = Math.sqrt(
	 Math.pow(point.x - previousPoint.x, 2) + Math.pow(point.y - previousPoint.y, 2),
	 )
	 return distance > acc ? distance : acc
	 }, 0)*/
	/*	const maxCurvature = 0.5
	 // const maxCurvature = 0.5
	 // const numPoints = 100

	 const curvePoints = createCurvedLineThroughPoints(pointsMappedToCenterToPoints, maxCurvature)
	 if (!curvePoints.length) {
	 return
	 }
	 console.log(curvePoints)
	 ctx.beginPath()
	 ctx.moveTo(curvePoints[0].x, curvePoints[0].y)
	 for (let i = 1; i < curvePoints.length; i++) {
	 ctx.lineTo(curvePoints[i].x, curvePoints[i].y)
	 }
	 ctx.stroke()*/

	/*	const curvePoints = createCurvedLineThroughPoints(allPoints, maxCurvature)
	 ctx.beginPath()
	 ctx.moveTo(curvePoints[0].x, curvePoints[0].y)
	 for (let i = 1; i < curvePoints.length; i++) {
	 ctx.lineTo(curvePoints[i].x, curvePoints[i].y)
	 }
	 ctx.stroke()*/

	// linksInOrder.forEach((link, linkIndex) => {
	// 	ctx.save()
	// 	ctx.beginPath()

	// 	if (linkIndex === 0) {
	// 		const { x, y } = link.linePoints[0]
	// 		ctx.moveTo(x, y)
	// 	}

	// 	let previousPoint = link.linePoints[0]
	// 	// let currentPoint = link.linePoints[1]

	// 	/*		if (selectedPanelLinkId === link.id) {
	// 	 ctx.strokeStyle = 'red'
	// 	 ctx.lineWidth = 2
	// 	 }

	// 	 if (hoveringOverPanelLinkInLinkMenu?.panelLinkId === link.id) {
	// 	 ctx.strokeStyle = 'red'
	// 	 ctx.lineWidth = 2
	// 	 }*/
	// 	// const allPoints = link.linePoints

	// 	link.linePoints.forEach((linePoint, index) => {
	// 		// const curvePoints = generateBezierCurvePoints(previousPoint, linePoint)
	// 		// curvePoints.forEach((point) => {
	// 		// 	ctx.lineTo(point.x, point.y)
	// 		// })
	// 		// const points = getMiddlePoint(previousPoint, linePoint)
	// 		// const curvature = 0.5
	// 		// const [controlPoint1, controlPoint2] = createBezierCurveControlPoints(
	// 		// 	previousPoint,
	// 		// 	currentPoint,
	// 		// 	linePoint,
	// 		// 	curvature,
	// 		// )
	// 		// ctx.bezierCurveTo(
	// 		// 	controlPoint1.x,
	// 		// 	controlPoint1.y,
	// 		// 	controlPoint2.x,
	// 		// 	controlPoint2.y,
	// 		// 	currentPoint.x,
	// 		// 	currentPoint.y,
	// 		// )
	// 		// const controlPoint = createQuadraticCurveControlPoint(previousPoint, linePoint)
	// 		// ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, linePoint.x, linePoint.y)
	// 		// const curvature = 0.5
	// 		const curvature = calculateCurvature(previousPoint, linePoint, maxDistance, maxCurvature)

	// 		const controlPoint = getControlPoint(previousPoint, previousPoint, linePoint, curvature)
	// 		ctx.bezierCurveTo(
	// 			previousPoint.x,
	// 			previousPoint.y,
	// 			controlPoint.x,
	// 			controlPoint.y,
	// 			linePoint.x,
	// 			linePoint.y,
	// 		)
	// 		// ctx.quadraticCurveTo(
	// 		// 	controlPoint.x,
	// 		// 	controlPoint.y,
	// 		// 	linePoint.x,
	// 		// 	linePoint.y,
	// 		// )

	// 		previousPoint = linePoint
	// 		// currentPoint = linePoint

	// 		// ctx.bezierCurveTo()

	// 		/*			ctx.bezierCurveTo(
	// 		 previousPoint.x,
	// 		 previousPoint.y,
	// 		 linePoint.x,
	// 		 linePoint.y,
	// 		 linePoint.x,
	// 		 linePoint.y,
	// 		 )*/
	// 		/*			if (linkIndex === 0) {
	// 		 const { x, y } = linePoint
	// 		 ctx.moveTo(x, y)
	// 		 return
	// 		 }*/

	// 		/* else if (index === 0) {
	// 		 const { x, y } = linePoint
	// 		 ctx.bezierCurveTo(x, y, x, y, x, y)
	// 		 }*/
	// 		/*			const drawFn = index === 0 ? ctx.moveTo : ctx.lineTo
	// 		 const currentPanelId = index === 0 ? link.positivePanelId : link.negativePanelId
	// 		 const point = customIds.includes(currentPanelId)
	// 		 ? getSymbolLocationBasedOnIndex(index, customEntities, currentPanelId)
	// 		 : linePoint
	// 		 drawFn.call(ctx, point.x, point.y)*/
	// 		/*			if (index === 0) {
	// 		 ctx.moveTo(linePoint.x, linePoint.y)
	// 		 } else {
	// 		 ctx.bezierCurveTo(
	// 		 linePoint.x,
	// 		 linePoint.y,
	// 		 linePoint.x,
	// 		 linePoint.y,
	// 		 linePoint.x,
	// 		 linePoint.y,
	// 		 )
	// 		 }*/
	// 	})

	// 	ctx.stroke()
	// 	ctx.restore()
	// })
	ctx.restore()
}

export function generateBezierCurvePoints(
	startPoint: {
		x: number
		y: number
	},
	endPoint: {
		x: number
		y: number
	},
): {
	x: number
	y: number
}[] {
	const controlPoint1 = { x: startPoint.x + (endPoint.x - startPoint.x) / 3, y: startPoint.y }
	const controlPoint2 = { x: endPoint.x - (endPoint.x - startPoint.x) / 3, y: endPoint.y }
	const points: {
		x: number
		y: number
	}[] = []

	for (let t = 0; t <= 1; t += 0.01) {
		const x =
			(1 - t) ** 2 * startPoint.x + 2 * (1 - t) * t * controlPoint1.x + t ** 2 * controlPoint2.x
		const y =
			(1 - t) ** 2 * startPoint.y + 2 * (1 - t) * t * controlPoint1.y + t ** 2 * controlPoint2.y
		points.push({ x, y })
	}

	return points
}

// export function getMiddlePoint(previousPoint: Point, currentPoint: Point, nextPoint: Point): Point {
// 	const distance1 = Math.sqrt(Math.pow(currentPoint.x - previousPoint.x, 2) + Math.pow(currentPoint.y - previousPoint.y, 2));
// 	const distance2 = Math.sqrt(Math.pow(nextPoint.x - currentPoint.x, 2) + Math.pow(nextPoint.y - currentPoint.y, 2));
// 	const totalDistance = distance1 + distance2;

// 	const ratio1 = distance1 / totalDistance;
// 	const ratio2 = distance2 / totalDistance;

// 	const middleX = currentPoint.x + (nextPoint.x - previousPoint.x) * ratio1;
// 	const middleY = currentPoint.y + (nextPoint.y - previousPoint.y) * ratio1;

// 	return { x: middleX, y: middleY };
//   }

export function getMiddlePoint(previousPoint: Point, followingPoint: Point): Point {
	const middleX = (previousPoint.x + followingPoint.x) / 2
	const middleY = (previousPoint.y + followingPoint.y) / 2

	return { x: middleX, y: middleY }
}

export function getControlPoint(
	previousPoint: Point,
	currentPoint: Point,
	nextPoint: Point,
	curvature: number,
): Point {
	const distance1 = Math.sqrt(
		Math.pow(currentPoint.x - previousPoint.x, 2) + Math.pow(currentPoint.y - previousPoint.y, 2),
	)
	const distance2 = Math.sqrt(
		Math.pow(nextPoint.x - currentPoint.x, 2) + Math.pow(nextPoint.y - currentPoint.y, 2),
	)
	const totalDistance = distance1 + distance2

	const ratio1 = distance1 / totalDistance
	const ratio2 = distance2 / totalDistance

	const middleX = currentPoint.x + (nextPoint.x - previousPoint.x) * ratio1
	const middleY = currentPoint.y + (nextPoint.y - previousPoint.y) * ratio1

	const dx = nextPoint.x - previousPoint.x
	const dy = nextPoint.y - previousPoint.y
	const angle = Math.atan2(dy, dx)

	const controlX = middleX + Math.cos(angle + Math.PI / 2) * curvature
	const controlY = middleY + Math.sin(angle + Math.PI / 2) * curvature

	return { x: controlX, y: controlY }
}

export function createBezierCurveControlPoints(
	previousPoint: Point,
	currentPoint: Point,
	nextPoint: Point,
	curvature: number,
): [Point, Point] {
	const distance1 = Math.sqrt(
		Math.pow(currentPoint.x - previousPoint.x, 2) + Math.pow(currentPoint.y - previousPoint.y, 2),
	)
	const distance2 = Math.sqrt(
		Math.pow(nextPoint.x - currentPoint.x, 2) + Math.pow(nextPoint.y - currentPoint.y, 2),
	)
	const totalDistance = distance1 + distance2

	const ratio1 = distance1 / totalDistance
	const ratio2 = distance2 / totalDistance

	const middleX = currentPoint.x + (nextPoint.x - previousPoint.x) * ratio1
	const middleY = currentPoint.y + (nextPoint.y - previousPoint.y) * ratio1

	const dx = nextPoint.x - previousPoint.x
	const dy = nextPoint.y - previousPoint.y
	const angle = Math.atan2(dy, dx)

	const controlDistance = totalDistance * curvature
	const controlX1 = middleX + Math.cos(angle + Math.PI / 2) * controlDistance
	const controlY1 = middleY + Math.sin(angle + Math.PI / 2) * controlDistance
	const controlX2 = middleX + Math.cos(angle - Math.PI / 2) * controlDistance
	const controlY2 = middleY + Math.sin(angle - Math.PI / 2) * controlDistance

	return [
		{ x: controlX1, y: controlY1 },
		{ x: controlX2, y: controlY2 },
	]
}

export function createQuadraticCurveControlPoint(
	previousPoint: Point,
	followingPoint: Point,
): Point {
	const controlX = previousPoint.x
	const controlY = followingPoint.y

	return { x: controlX, y: controlY }
}

export const maxDistance = 1000 // adjust as needed
export const maxCurvature = 50 // adjust as needed
// export const maxCurvature = 0.5 // adjust as needed

export function calculateCurvature(
	currentPoint: Point,
	nextPoint: Point,
	maxDistance: number,
	maxCurvature: number,
): number {
	const distance = Math.sqrt(
		Math.pow(nextPoint.x - currentPoint.x, 2) + Math.pow(nextPoint.y - currentPoint.y, 2),
	)
	const ratio = distance / maxDistance
	const curvature = ratio * maxCurvature
	return curvature
}

export function createCurvedLine(
	start: Point,
	end: Point,
	middle: Point,
	curvature: number,
): Point[] {
	const controlPoint1 = getControlPoint(start, end, middle, curvature)
	const controlPoint2 = getControlPoint(middle, end, start, curvature)

	const points: Point[] = []

	for (let t = 0; t <= 1; t += 0.01) {
		const x =
			Math.pow(1 - t, 3) * start.x +
			3 * Math.pow(1 - t, 2) * t * controlPoint1.x +
			3 * (1 - t) * Math.pow(t, 2) * controlPoint2.x +
			Math.pow(t, 3) * end.x
		const y =
			Math.pow(1 - t, 3) * start.y +
			3 * Math.pow(1 - t, 2) * t * controlPoint1.y +
			3 * (1 - t) * Math.pow(t, 2) * controlPoint2.y +
			Math.pow(t, 3) * end.y
		points.push({ x, y })
	}

	return points
}

export function createCurvedLineThroughPoints(points: Point[], curvature: number): Point[] {
	const result: Point[] = []

	for (let i = 0; i < points.length - 1; i++) {
		const start = points[i]
		const end = points[i + 1]
		const middle = i > 0 ? points[i - 1] : start
		const nextMiddle = i < points.length - 2 ? points[i + 2] : end

		const curvature1 = calculateCurvature(start, middle, maxDistance, curvature)
		const curvature2 = calculateCurvature(middle, end, maxDistance, curvature)
		const curvature3 = calculateCurvature(end, nextMiddle, maxDistance, curvature)

		const controlPoint1 = getControlPoint(start, middle, end, curvature1)
		const controlPoint2 = getControlPoint(middle, end, start, curvature2)
		const controlPoint3 = getControlPoint(end, nextMiddle, middle, curvature3)

		for (let t = 0; t <= 1; t += 0.01) {
			const x =
				Math.pow(1 - t, 3) * start.x +
				3 * Math.pow(1 - t, 2) * t * controlPoint1.x +
				3 * (1 - t) * Math.pow(t, 2) * controlPoint2.x +
				Math.pow(t, 3) * end.x
			const y =
				Math.pow(1 - t, 3) * start.y +
				3 * Math.pow(1 - t, 2) * t * controlPoint1.y +
				3 * (1 - t) * Math.pow(t, 2) * controlPoint2.y +
				Math.pow(t, 3) * end.y
			result.push({ x, y })
		}
	}

	return result
}

//   export function drawCurvedLineWithGradientFill(points, colorStops) {
// 	const canvas = document.createElement('canvas');
// 	const context = canvas.getContext('2d');

// 	// Set the canvas size to the bounding box of the points
// 	const minX = Math.min(...points.map(p => p.x));
// 	const minY = Math.min(...points.map(p => p.y));
// 	const maxX = Math.max(...points.map(p => p.x));
// 	const maxY = Math.max(...points.map(p => p.y));
// 	canvas.width = maxX - minX;
// 	canvas.height = maxY - minY;

// 	// Translate the canvas so that the curve starts at (0, 0)
// 	context.translate(-minX, -minY);

// 	// Create a gradient fill
// 	const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
// 	for (let i = 0; i < colorStops.length; i++) {
// 	  gradient.addColorStop(colorStops[i].offset, colorStops[i].color);
// 	}

// 	// Draw the curve
// 	context.beginPath();
// 	context.moveTo(points[0].x, points[0].y);
// 	for (let i = 1; i < points.length - 2; i++) {
// 	  const xc = (points[i].x + points[i + 1].x) / 2;
// 	  const yc = (points[i].y + points[i + 1].y) / 2;
// 	  context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
// 	}
// 	// curve through the last two points
// 	context.quadraticCurveTo(
// 	  points[points.length - 2].x,
// 	  points[points.length - 2].y,
// 	  points[points.length - 1].x,
// 	  points[points.length - 1].y
// 	);
// 	context.strokeStyle = gradient;
// 	context.lineWidth = 10;
// 	context.stroke();

// 	// Return the canvas element
// 	return canvas;
//   }

/*
 ctx.moveTo(pointsMappedToCenterToPoints[0].x, pointsMappedToCenterToPoints[0].y)

 for (let i = 1; i < pointsMappedToCenterToPoints.length - 2; i++) {
 const xc = (pointsMappedToCenterToPoints[i].x + pointsMappedToCenterToPoints[i + 1].x) / 2
 const yc = (pointsMappedToCenterToPoints[i].y + pointsMappedToCenterToPoints[i + 1].y) / 2
 ctx.quadraticCurveTo(
 pointsMappedToCenterToPoints[i].x,
 pointsMappedToCenterToPoints[i].y,
 xc,
 yc,
 )
 }

 // curve through the last two points
 ctx.quadraticCurveTo(
 pointsMappedToCenterToPoints[pointsMappedToCenterToPoints.length - 2].x,
 pointsMappedToCenterToPoints[pointsMappedToCenterToPoints.length - 2].y,
 pointsMappedToCenterToPoints[pointsMappedToCenterToPoints.length - 1].x,
 pointsMappedToCenterToPoints[pointsMappedToCenterToPoints.length - 1].y,
 )
 ctx.stroke()*/
