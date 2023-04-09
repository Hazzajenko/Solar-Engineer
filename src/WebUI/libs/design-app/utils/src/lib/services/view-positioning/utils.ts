import { EntityElement } from '@design-app/shared'
import { MIN_ZOOM, ZOOM_STEP } from 'design-app/utils'

const zoomValueToFitBoundsOnViewport = (
  bounds: [number, number, number, number],
  viewportDimensions: {
    width: number
    height: number
  },
) => {
  const [x1, y1, x2, y2] = bounds
  const commonBoundsWidth = x2 - x1
  const zoomValueForWidth = viewportDimensions.width / commonBoundsWidth
  const commonBoundsHeight = y2 - y1
  const zoomValueForHeight = viewportDimensions.height / commonBoundsHeight
  const smallestZoomValue = Math.min(zoomValueForWidth, zoomValueForHeight)
  const zoomAdjustedToSteps = Math.floor(smallestZoomValue / ZOOM_STEP) * ZOOM_STEP
  return Math.min(Math.max(zoomAdjustedToSteps, MIN_ZOOM), 1)
}

export const getCommonBounds = (
  elements: readonly EntityElement[],
): [number, number, number, number] => {
  if (!elements.length) {
    return [0, 0, 0, 0]
  }

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  elements.forEach((element) => {
    const [x1, y1, x2, y2] = getElementAbsoluteCoords(element)
    minX = Math.min(minX, x1)
    minY = Math.min(minY, y1)
    maxX = Math.max(maxX, x2)
    maxY = Math.max(maxY, y2)
  })

  return [minX, minY, maxX, maxY]
}

export const getElementAbsoluteCoords = (
  element: EntityElement,
): [number, number, number, number, number, number] => {
  return [
    element.x,
    element.y,
    element.x + element.width,
    element.y + element.height,
    element.x + element.width / 2,
    element.y + element.height / 2,
  ]
}

const getBoundsFromPoints = (
  points: readonly [number, number][],
): [number, number, number, number] => {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const [x, y] of points) {
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }

  return [minX, minY, maxX, maxY]
}
/*

 export const getElementBounds = (element: EntityElement): [number, number, number, number] => {
 let bounds: [number, number, number, number]

 const [x1, y1, x2, y2, cx, cy] = getElementAbsoluteCoords(element)
 if (isFreeDrawElement(element)) {
 const [minX, minY, maxX, maxY] = getBoundsFromPoints(
 element.points.map(([x, y]) => rotate(x, y, cx - element.x, cy - element.y, element.angle)),
 )

 return [minX + element.x, minY + element.y, maxX + element.x, maxY + element.y]
 } else if (isLinearElement(element)) {
 bounds = getLinearElementRotatedBounds(element, cx, cy)
 } else if (element.type === 'diamond') {
 const [x11, y11] = rotate(cx, y1, cx, cy, element.angle)
 const [x12, y12] = rotate(cx, y2, cx, cy, element.angle)
 const [x22, y22] = rotate(x1, cy, cx, cy, element.angle)
 const [x21, y21] = rotate(x2, cy, cx, cy, element.angle)
 const minX = Math.min(x11, x12, x22, x21)
 const minY = Math.min(y11, y12, y22, y21)
 const maxX = Math.max(x11, x12, x22, x21)
 const maxY = Math.max(y11, y12, y22, y21)
 bounds = [minX, minY, maxX, maxY]
 } else if (element.type === 'ellipse') {
 const w = (x2 - x1) / 2
 const h = (y2 - y1) / 2
 const cos = Math.cos(element.angle)
 const sin = Math.sin(element.angle)
 const ww = Math.hypot(w * cos, h * sin)
 const hh = Math.hypot(h * cos, w * sin)
 bounds = [cx - ww, cy - hh, cx + ww, cy + hh]
 } else {
 const [x11, y11] = rotate(x1, y1, cx, cy, element.angle)
 const [x12, y12] = rotate(x1, y2, cx, cy, element.angle)
 const [x22, y22] = rotate(x2, y2, cx, cy, element.angle)
 const [x21, y21] = rotate(x2, y1, cx, cy, element.angle)
 const minX = Math.min(x11, x12, x22, x21)
 const minY = Math.min(y11, y12, y22, y21)
 const maxX = Math.max(x11, x12, x22, x21)
 const maxY = Math.max(y11, y12, y22, y21)
 bounds = [minX, minY, maxX, maxY]
 }

 return bounds
 }

 export const getElementAbsoluteCoords = (
 element: EntityElement,
 ): [number, number, number, number, number, number] => {
 return [
 element.x,
 element.y,
 element.x + element.width,
 element.y + element.height,
 element.x + element.width / 2,
 element.y + element.height / 2,
 ]
 }

 const getBoundsFromPoints = (
 points: readonly [number, number][]
 ): [number, number, number, number] => {
 let minX = Infinity;
 let minY = Infinity;
 let maxX = -Infinity;
 let maxY = -Infinity;

 for (const [x, y] of points) {
 minX = Math.min(minX, x);
 minY = Math.min(minY, y);
 maxX = Math.max(maxX, x);
 maxY = Math.max(maxY, y);
 }

 return [minX, minY, maxX, maxY];
 };
 */

/*
 export const calculateScrollCenter = (
 elements: readonly ExcalidrawElement[],
 appState: AppState,
 canvas: HTMLCanvasElement | null,
 ): {
 scrollX: number
 scrollY: number
 } => {
 elements = getVisibleElements(elements)

 if (!elements.length) {
 return {
 scrollX: 0,
 scrollY: 0,
 }
 }
 let [x1, y1, x2, y2] = getCommonBounds(elements)

 if (isOutsideViewPort(appState, canvas, [x1, y1, x2, y2])) {
 [x1, y1, x2, y2] = getClosestElementBounds(
 elements,
 viewportCoordsToSceneCoords(
 { clientX: appState.scrollX, clientY: appState.scrollY },
 appState,
 ),
 )
 }

 const centerX = (x1 + x2) / 2
 const centerY = (y1 + y2) / 2

 return centerScrollOn({
 scenePoint: { x: centerX, y: centerY },
 viewportDimensions: { width: appState.width, height: appState.height },
 zoom: appState.zoom,
 })
 }

 export const centerScrollOn = ({
 scenePoint,
 viewportDimensions,
 zoom,
 }: {
 scenePoint: PointerCoords
 viewportDimensions: {
 height: number
 width: number
 }
 zoom: Zoom
 }) => {
 return {
 scrollX: (viewportDimensions.width / 2) * (1 / zoom.value) - scenePoint.x,
 scrollY: (viewportDimensions.height / 2) * (1 / zoom.value) - scenePoint.y,
 }
 }

 export const getCommonBounds = (
 elements: readonly ExcalidrawElement[],
 ): [number, number, number, number] => {
 if (!elements.length) {
 return [0, 0, 0, 0]
 }

 let minX = Infinity
 let maxX = -Infinity
 let minY = Infinity
 let maxY = -Infinity

 elements.forEach((element) => {
 const [x1, y1, x2, y2] = getElementBounds(element)
 minX = Math.min(minX, x1)
 minY = Math.min(minY, y1)
 maxX = Math.max(maxX, x2)
 maxY = Math.max(maxY, y2)
 })

 return [minX, minY, maxX, maxY]
 }

 const isOutsideViewPort = (
 appState: AppState,
 canvas: HTMLCanvasElement | null,
 cords: Array<number>,
 ) => {
 const [x1, y1, x2, y2] = cords
 const { x: viewportX1, y: viewportY1 } = sceneCoordsToViewportCoords(
 { sceneX: x1, sceneY: y1 },
 appState,
 )
 const { x: viewportX2, y: viewportY2 } = sceneCoordsToViewportCoords(
 { sceneX: x2, sceneY: y2 },
 appState,
 )
 return viewportX2 - viewportX1 > appState.width || viewportY2 - viewportY1 > appState.height
 }

 export const sceneCoordsToViewportCoords = (
 {
 sceneX,
 sceneY,
 }: {
 sceneX: number
 sceneY: number
 },
 {
 zoom,
 offsetLeft,
 offsetTop,
 scrollX,
 scrollY,
 }: {
 zoom: Zoom
 offsetLeft: number
 offsetTop: number
 scrollX: number
 scrollY: number
 },
 ) => {
 const x = (sceneX + scrollX) * zoom.value + offsetLeft
 const y = (sceneY + scrollY) * zoom.value + offsetTop
 return { x, y }
 }
 */