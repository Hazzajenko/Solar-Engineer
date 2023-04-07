export type DesignRectModel = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export type DesignRectModelWithDistance = DesignRectModel & {
  distance: number
}
