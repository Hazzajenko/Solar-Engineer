import { BlockRectModel } from '@grid-layout/data-access'
import {
  bottomLeftCorner,
  bottomRightCorner,
  bottomSide,
  leftSide,
  rightSide,
  topLeftCorner,
  topRightCorner,
  topSide,
} from './block-starts'

export function handleXAxisSame(
  drawingUp: boolean,
  firstY: number,
  firstHeight: number,
  secondY: number,
  secondHeight: number,
) {
  const firstResultY = drawingUp ? firstY - firstHeight / 2 : firstY + firstHeight / 2
  const secondResultY = drawingUp ? secondY + secondHeight / 2 : secondY - secondHeight / 2
  return { firstResultY, secondResultY }
}

export function handleYAxisSame(
  drawingLeft: boolean,
  firstX: number,
  firstWidth: number,
  secondX: number,
  secondWidth: number,
) {
  const firstResultX = drawingLeft ? firstX - firstWidth / 2 : firstX + firstWidth / 2
  const secondResultX = drawingLeft ? secondX + secondWidth / 2 : secondX - secondWidth / 2
  return { firstResultX, secondResultX }
}

export function upAndLeft(
  twoBlocks: { first: BlockRectModel; second: BlockRectModel },
  xDifference: number,
  yDifference: number,
) {
  const first = twoBlocks.first
  const second = twoBlocks.second
  if (xDifference === yDifference) {
    const { x: firstResultX, y: firstResultY } = topLeftCorner(first)
    const { x: secondResultX, y: secondResultY } = bottomRightCorner(second)
    return { firstResultX, firstResultY, secondResultX, secondResultY }
  }
  if (xDifference > yDifference) {
    const { x: firstResultX } = leftSide(first)
    const { x: secondResultX } = rightSide(second)
    return { firstResultX, firstResultY: first.y, secondResultX, secondResultY: second.y }
  } else {
    const { y: firstResultY } = topSide(first)
    const { y: secondResultY } = bottomSide(second)
    return { firstResultX: first.x, firstResultY, secondResultX: second.x, secondResultY }
  }
}

export function upAndRight(
  twoBlocks: { first: BlockRectModel; second: BlockRectModel },
  xDifference: number,
  yDifference: number,
) {
  const first = twoBlocks.first
  const second = twoBlocks.second
  if (xDifference === yDifference) {
    const { x: firstResultX, y: firstResultY } = topRightCorner(first)
    const { x: secondResultX, y: secondResultY } = bottomLeftCorner(second)
    return { firstResultX, firstResultY, secondResultX, secondResultY }
  }
  if (xDifference > yDifference) {
    const { x: firstResultX } = rightSide(first)
    const { x: secondResultX } = leftSide(second)
    return { firstResultX, firstResultY: first.y, secondResultX, secondResultY: second.y }
  } else {
    const { y: firstResultY } = topSide(first)
    const { y: secondResultY } = bottomSide(second)
    return { firstResultX: first.x, firstResultY, secondResultX: second.x, secondResultY }
  }
}

export function downAndLeft(
  twoBlocks: { first: BlockRectModel; second: BlockRectModel },
  xDifference: number,
  yDifference: number,
) {
  const first = twoBlocks.first
  const second = twoBlocks.second
  if (xDifference === yDifference) {
    const { x: firstResultX, y: firstResultY } = bottomLeftCorner(first)
    const { x: secondResultX, y: secondResultY } = topRightCorner(second)
    return { firstResultX, firstResultY, secondResultX, secondResultY }
  }
  if (xDifference > yDifference) {
    const { x: firstResultX } = leftSide(first)
    const { x: secondResultX } = rightSide(second)
    return { firstResultX, firstResultY: first.y, secondResultX, secondResultY: second.y }
  } else {
    const { y: firstResultY } = bottomSide(first)
    const { y: secondResultY } = topSide(second)
    return { firstResultX: first.x, firstResultY, secondResultX: second.x, secondResultY }
  }
}

export function downAndRight(
  twoBlocks: { first: BlockRectModel; second: BlockRectModel },
  xDifference: number,
  yDifference: number,
) {
  const first = twoBlocks.first
  const second = twoBlocks.second
  if (xDifference === yDifference) {
    const { x: firstResultX, y: firstResultY } = bottomRightCorner(first)
    const { x: secondResultX, y: secondResultY } = topLeftCorner(second)
    return { firstResultX, firstResultY, secondResultX, secondResultY }
  }
  if (xDifference > yDifference) {
    const { x: firstResultX } = rightSide(first)
    const { x: secondResultX } = leftSide(second)
    return { firstResultX, firstResultY: first.y, secondResultX, secondResultY: second.y }
  } else {
    const { y: firstResultY } = bottomSide(first)
    const { y: secondResultY } = topSide(second)
    return { firstResultX: first.x, firstResultY, secondResultX: second.x, secondResultY }
  }
}
