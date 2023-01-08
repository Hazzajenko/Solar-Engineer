import { BlockRectModel } from '@grid-layout/shared/models'

export function topLeftCorner(rect: BlockRectModel) {
  const x = rect.x - rect.width / 2.5
  const y = rect.y - rect.height / 2.5
  return { x, y }
}

export function topRightCorner(rect: BlockRectModel) {
  const x = rect.x + rect.width / 2.5
  const y = rect.y - rect.height / 2.5
  return { x, y }
}

export function bottomLeftCorner(rect: BlockRectModel) {
  const x = rect.x - rect.width / 2.5
  const y = rect.y + rect.height / 2.5
  return { x, y }
}

export function bottomRightCorner(rect: BlockRectModel) {
  const x = rect.x + rect.width / 2.5
  const y = rect.y + rect.height / 2.5
  return { x, y }
}

export function leftSide(rect: BlockRectModel) {
  // firstResultX = first.x - first.width / 2
  // secondResultX = second.x + second.width / 2
  const x = rect.x - rect.width / 2
  // const y = rect.y + rect.height / 2.5
  return { x }
}

export function rightSide(rect: BlockRectModel) {
  // firstResultX = first.x - first.width / 2
  // secondResultX = second.x + second.width / 2
  const x = rect.x + rect.width / 2
  // const y = rect.y + rect.height / 2.5
  return { x }
}

export function topSide(rect: BlockRectModel) {
  const y = rect.y - rect.height / 2
  return { y }
}

export function bottomSide(rect: BlockRectModel) {
  const y = rect.y + rect.height / 2
  return { y }
}


// secondResultY = second.y + second.height / 2.5
// secondResultX = second.x + second.width / 2.5