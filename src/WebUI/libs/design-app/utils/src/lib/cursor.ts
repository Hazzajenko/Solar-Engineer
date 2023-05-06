import { CURSOR_TYPE, CursorType } from '@shared/data-access/models'

export const changeCanvasCursor = (canvas: HTMLCanvasElement, cursor: CursorType) => {
	// console.log('changeCanvasCursor', cursor)
	canvas.style.cursor = cursor
}

export const changeCanvasCursorIfNotAuto = (canvas: HTMLCanvasElement, cursor: CursorType) => {
	if (canvas.style.cursor !== CURSOR_TYPE.AUTO) {
		canvas.style.cursor = cursor
	}
}

export const changeBodyCursor = (cursor: CursorType) => {
	document.body.style.cursor = cursor
}