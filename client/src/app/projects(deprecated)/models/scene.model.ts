export class SceneModel {
  rows: number
  cols: number
  xPosition: number
  yPosition: number

  constructor(rows: number, cols: number, xPosition: number, yPosition: number) {
    this.rows = rows
    this.cols = cols
    this.xPosition = xPosition
    this.yPosition = yPosition
  }
}
