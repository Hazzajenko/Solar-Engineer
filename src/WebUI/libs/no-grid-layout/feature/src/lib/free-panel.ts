export class FreePanel {
  id: string
  x: number
  y: number
  width: number
  height: number
  border: string

  constructor(id: string, x: number, y: number, width: number, height: number, border: string) {
    this.id = id
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.border = border
  }

  updateLocation(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  updateSize(width: number, height: number) {
    this.width = width
    this.height = height
    return this
  }
}
