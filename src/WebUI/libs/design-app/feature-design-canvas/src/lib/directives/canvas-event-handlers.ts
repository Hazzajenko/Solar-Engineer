import { AppStateValue } from '../services'
import { TransformedPoint } from '../types'

export interface DesignCanvasEventHandlers {
	onMouseDownHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	onMouseMoveHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	onMouseUpHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	mouseClickHandler(event: PointerEvent, currentPoint: TransformedPoint, state: AppStateValue): void

	doubleClickHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	contextMenuHandler(event: PointerEvent, currentPoint: TransformedPoint): void

	wheelScrollHandler(event: WheelEvent): void

	keyUpHandler(event: KeyboardEvent): void
}