import { CursorType } from '@shared/data-access/models'

export const resetCursor = (canvas: HTMLCanvasElement | null) => {
  if (canvas) {
    canvas.style.cursor = ''
  }
}

export const setCursor = (canvas: HTMLCanvasElement | null, cursor: CursorType) => {
  if (canvas) {
    canvas.style.cursor = cursor
  }
}