import { CursorType } from '@shared/data-access/models'

export const changeCanvasCursor = (canvas: HTMLCanvasElement, cursor: CursorType) => {
  canvas.style.cursor = cursor
}