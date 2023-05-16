import { CURSOR_TYPE, CursorType } from '@shared/data-access/models'

export const changeCanvasCursor = (canvas: HTMLCanvasElement, cursor: CursorType) => {
	// console.log('changeCanvasCursor', cursor)
	canvas.style.cursor = cursor
	/*	setTimeout(() => {
	 canvas.style.cursor = cursor
	 }, 10)*/
}

/*private updateCursor(cursor: string) {
 setTimeout(() => {
 this.canvas.style.cursor = cursor;
 }, 0);
 }*/

export const changeCanvasCursorIfNotSet = (canvas: HTMLCanvasElement, cursor: CursorType) => {
	if (canvas.style.cursor !== cursor) {
		canvas.style.cursor = cursor
	}
}

export const setCanvasCursorToAuto = (canvas: HTMLCanvasElement) => {
	canvas.style.cursor = CURSOR_TYPE.AUTO
}

export const changeCanvasCursorIfNotAuto = (canvas: HTMLCanvasElement, cursor: CursorType) => {
	if (canvas.style.cursor !== CURSOR_TYPE.AUTO) {
		canvas.style.cursor = cursor
	}
}

export const changeBodyCursor = (cursor: CursorType) => {
	document.body.style.cursor = cursor
}
