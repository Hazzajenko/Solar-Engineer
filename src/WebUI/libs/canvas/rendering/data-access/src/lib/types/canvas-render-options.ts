import { TransformedPoint } from '@shared/data-access/models'
import { CanvasEntity, CanvasPanel } from '@entities/shared'

export type CanvasRenderOptions = {
	drawFns?: ((ctx: CanvasRenderingContext2D) => void)[]
	drawFnsAtMiddle?: ((ctx: CanvasRenderingContext2D) => void)[]
	drawFnsAtEnd?: ((ctx: CanvasRenderingContext2D) => void)[]
	excludedEntityIds?: string[]
	customEntities?: CanvasEntity[]
	currentLocation?: TransformedPoint
	shouldRenderSelectedEntitiesBox?: boolean
	shouldRenderSelectedStringBox?: boolean
	customPanels?: CanvasPanel[]
	singleToMoveId?: string
	// singleToMove
}

export type CanvasRenderOptionsV2 = {
	drawFns?: ((ctx: CanvasRenderingContext2D) => void)[]
	drawFnsAtMiddle?: ((ctx: CanvasRenderingContext2D) => void)[]
	drawFnsAtEnd?: ((ctx: CanvasRenderingContext2D) => void)[]
	excludedEntityIds?: string[]
	customEntities?: CanvasEntity[]
	currentLocation?: TransformedPoint
	shouldRenderSelectedEntitiesBox?: boolean
	shouldRenderSelectedStringBox?: boolean
}
