export interface FreeBlockRectModel {
  id: string
  x: number
  y: number
  width: number
  height: number
  element?: Element
}

export interface FreeBlockRectModelWithDistance extends FreeBlockRectModel {
  distance: number
}
