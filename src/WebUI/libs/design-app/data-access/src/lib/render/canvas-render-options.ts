export type CanvasRenderOptions = {
	drawFns?: ((ctx: CanvasRenderingContext2D) => void)[]
	excludedEntityIds?: string[]
	shouldRenderSelectedEntitiesBox?: boolean
	shouldRenderSelectedStringBox?: boolean
}
