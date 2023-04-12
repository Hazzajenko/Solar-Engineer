import { CanvasEntity } from '../types/canvas-entity'

export function halfOfWidth<T extends CanvasEntity>(entity: T) {
  return entity.width / 2
}

export function halfOfHeight<T extends CanvasEntity>(entity: T) {
  return entity.height / 2
}

export function getEntitySizeOffset<T extends CanvasEntity>(entity: T) {
  return {
    widthOffset: halfOfWidth(entity),
    heightOffset: halfOfHeight(entity),
  }
}