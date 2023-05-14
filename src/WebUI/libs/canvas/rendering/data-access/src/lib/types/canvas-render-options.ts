import { CanvasEntity, TransformedPoint } from '@shared/data-access/models'

export type CanvasRenderOptions = {
	drawFns?: ((ctx: CanvasRenderingContext2D) => void)[]
	excludedEntityIds?: string[]
	customEntities?: CanvasEntity[]
	currentLocation?: TransformedPoint
	shouldRenderSelectedEntitiesBox?: boolean
	shouldRenderSelectedStringBox?: boolean
}
