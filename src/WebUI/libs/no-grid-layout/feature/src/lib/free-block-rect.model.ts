export interface FreeBlockRectModel {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface FreeBlockRectModelWithDistance extends FreeBlockRectModel {
  distance: number
}

/*

 export type FreeBlockRectModelWithDistance = FreeBlockRectModel & {
 distance: number
 }*/