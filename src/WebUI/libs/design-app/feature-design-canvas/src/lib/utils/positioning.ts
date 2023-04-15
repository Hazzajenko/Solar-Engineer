/*
 import { CanvasEntity } from '@design-app/feature-design-canvas'
 import { EntityElement } from '@design-app/shared'
 import { adjustXYWithRotation } from '@shared/utils'

 const getAdjustedDimensions = (
 element: CanvasEntity,
 nextText: string,
 ): {
 x: number
 y: number
 width: number
 height: number
 // baseline: number
 } => {
 // let maxWidth = null;
 /!*  const container = getContainerElement(element);
 if (container) {
 maxWidth = getMaxContainerWidth(container);
 }
 const {
 width: nextWidth,
 height: nextHeight,
 baseline: nextBaseline,
 } = measureText(nextText, getFontString(element), maxWidth);
 const { textAlign, verticalAlign } = element;*!/
 // let x: number;
 // let y: number;
 // const [x1, y1, x2, y2] = getElementAbsoluteCoords(element)

 const [nextX1, nextY1, nextX2, nextY2] = getResizedElementAbsoluteCoords(
 element,
 element.width,
 element.height,
 false,
 )
 const deltaX1 = (x1 - nextX1) / 2
 const deltaY1 = (y1 - nextY1) / 2
 const deltaX2 = (x2 - nextX2) / 2
 const deltaY2 = (y2 - nextY2) / 2

 const [x, y] = adjustXYWithRotation(
 {
 s: true,
 // e: textAlign === "center" || textAlign === "left",
 // w: textAlign === "center" || textAlign === "right",
 },
 element.location.x,
 element.location.y,
 element.angle,
 deltaX1,
 deltaY1,
 deltaX2,
 deltaY2,
 )

 /!*  // make sure container dimensions are set properly when
 // text editor overflows beyond viewport dimensions
 if (container) {
 const boundTextElementPadding = getBoundTextElementOffset(element);

 const containerDims = getContainerDims(container);
 let height = containerDims.height;
 let width = containerDims.width;
 if (nextHeight > height - boundTextElementPadding * 2) {
 height = nextHeight + boundTextElementPadding * 2;
 }
 if (nextWidth > width - boundTextElementPadding * 2) {
 width = nextWidth + boundTextElementPadding * 2;
 }
 if (
 !isArrowElement(container) &&
 (height !== containerDims.height || width !== containerDims.width)
 ) {
 mutateElement(container, { height, width });
 }
 }*!/
 return {
 width: element.width,
 height: element.height,
 x: Number.isFinite(x) ? x : element.location.x,
 y: Number.isFinite(y) ? y : element.location.y,
 // baseline: nextBaseline,
 }
 }

 const getResizedElementAbsoluteCoords = (
 element: CanvasEntity,
 nextWidth: number,
 nextHeight: number,
 normalizePoints: boolean,
 ): [number, number, number, number] => {
 return [
 element.location.x,
 element.location.y,
 element.location.x + nextWidth,
 element.location.y + nextHeight,
 ]
 }

 const getElementAbsoluteCoords = (
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
 }*/
