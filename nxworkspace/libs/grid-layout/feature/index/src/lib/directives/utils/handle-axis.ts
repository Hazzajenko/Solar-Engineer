import { BlockRectModel } from '@grid-layout/shared/models'
import {
  bottomLeftCorner,
  bottomRightCorner, bottomSide,
  leftSide, rightSide,
  topLeftCorner, topRightCorner, topSide,
} from 'libs/grid-layout/feature/index/src/lib/directives/utils/block-starts'

export function handleXAxisSame(drawingUp: boolean, firstY: number, firstHeight: number, secondY: number, secondHeight: number) {
  const firstResultY = drawingUp ? firstY - firstHeight / 2 : firstY + firstHeight / 2
  const secondResultY = drawingUp ? secondY + secondHeight / 2 : secondY - secondHeight / 2
  return { firstResultY, secondResultY }
}

export function handleYAxisSame(drawingLeft: boolean, firstX: number, firstWidth: number, secondX: number, secondWidth: number) {
  const firstResultX = drawingLeft ? firstX - firstWidth / 2 : firstX + firstWidth / 2
  const secondResultX = drawingLeft ? secondX + secondWidth / 2 : secondX - secondWidth / 2
  return { firstResultX, secondResultX }
}

export function upAndLeft(twoBlocks: { first: BlockRectModel, second: BlockRectModel }, xDifference: number, yDifference: number) {
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

export function upAndRight(twoBlocks: { first: BlockRectModel, second: BlockRectModel }, xDifference: number, yDifference: number) {
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

export function downAndLeft(twoBlocks: { first: BlockRectModel, second: BlockRectModel }, xDifference: number, yDifference: number) {
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

export function downAndRight(twoBlocks: { first: BlockRectModel, second: BlockRectModel }, xDifference: number, yDifference: number) {
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

export function handleDiagonal(drawingUp: boolean, drawingLeft: boolean, xYDifferencesSame: boolean, twoBlocks: { first: BlockRectModel, second: BlockRectModel }) {
  const { x: firstX, y: firstY, width: firstWidth, height: firstHeight } = twoBlocks.first
  const { x: secondX, y: secondY, width: secondWidth, height: secondHeight } = twoBlocks.second

  let firstResultX: number | undefined
  let firstResultY: number | undefined
  let secondResultX: number | undefined
  let secondResultY: number | undefined


  if (drawingUp) {
    if (drawingLeft) {
      firstResultY = firstY - firstHeight / (xYDifferencesSame ? 2.5 : 2)
      secondResultY = secondY + secondHeight / (xYDifferencesSame ? 2.5 : 2)
      firstResultX = firstX - firstWidth / (xYDifferencesSame ? 2.5 : 2)
      secondResultX = secondX + secondWidth / (xYDifferencesSame ? 2.5 : 2)
    } else {
      firstResultY = firstY - firstHeight / (xYDifferencesSame ? 2.5 : 2)
      secondResultY = secondY + secondHeight / (xYDifferencesSame ? 2.5 : 2)
      firstResultX = firstX + firstWidth / (xYDifferencesSame ? 2.5 : 2)
      secondResultX = secondX - secondWidth / (xYDifferencesSame ? 2.5 : 2)
    }
  } else {
    if (drawingLeft) {
      firstResultY = firstY + firstHeight / (xYDifferencesSame ? 2.5 : 2)
      secondResultY = secondY - secondHeight / (xYDifferencesSame ? 2.5 : 2)
      firstResultX = firstX - firstWidth / (xYDifferencesSame ? 2.5 : 2)
      secondResultX = secondX + secondWidth / (xYDifferencesSame ? 2.5 : 2)
    } else {
      firstResultY = firstY + firstHeight / (xYDifferencesSame ? 2.5 : 2)
      secondResultY = secondY - secondHeight / (xYDifferencesSame ? 2.5 : 2)
      firstResultX = firstX + firstWidth / (xYDifferencesSame ? 2.5 : 2)
      secondResultX = secondX - secondWidth / (xYDifferencesSame ? 2.5 : 2)
    }
  }
  return { firstResultX, firstResultY, secondResultX, secondResultY }
}

export function startDiagonal(rect: BlockRectModel, first: boolean, x: boolean) {
  if (first) {
    if (x) {
      return rect.x - rect.width / 2.5
    } else {
      return rect.y - rect.height / 2.5
    }
  } else {
    if (x) {
      return rect.x + rect.width / 2.5
    } else {
      return rect.y + rect.height / 2.5
    }
  }
}

