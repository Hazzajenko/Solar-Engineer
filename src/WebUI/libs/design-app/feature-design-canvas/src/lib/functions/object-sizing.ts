import { CanvasPanel } from '../types/canvas-panel'

export function halfOfWidth<T extends CanvasPanel>(entity: T) {
  return entity.width / 2
}

export function halfOfHeight<T extends CanvasPanel>(entity: T) {
  return entity.height / 2
}

export function getEntitySizeOffset<T extends CanvasPanel>(entity: T) {
  return {
    widthOffset: halfOfWidth(entity),
    heightOffset: halfOfHeight(entity),
  }
}