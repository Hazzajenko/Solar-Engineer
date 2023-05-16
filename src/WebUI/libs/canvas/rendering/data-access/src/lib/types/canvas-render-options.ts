import {
	CompleteEntityBounds,
	CursorType,
	NearbyEntity,
	Point,
	SpotInBox,
	TransformedPoint,
} from '@shared/data-access/models'
import { CanvasEntity, CanvasPanel } from '@entities/shared'

export type CanvasRenderOptions = {
	drawFns: ((ctx: CanvasRenderingContext2D) => void)[]
	drawFnsAtMiddle: ((ctx: CanvasRenderingContext2D) => void)[]
	drawFnsAtEnd: ((ctx: CanvasRenderingContext2D) => void)[]
	excludedEntityIds: string[]
	customEntities: CanvasEntity[]
	currentLocation: TransformedPoint
	shouldRenderSelectedEntitiesBox: boolean
	shouldRenderSelectedStringBox: boolean
	customPanels: CanvasPanel[]
	singleToMoveId: string
	selectionBox: {
		x: number
		y: number
		width: number
		height: number
	}
	creationBox: {
		x: number
		y: number
		width: number
		height: number
		spots: SpotInBox[]
	}
	nearby: {
		axisPreviewRect: CompleteEntityBounds
		mouseBounds: CompleteEntityBounds
		closestEntity: NearbyEntity
		snapToGridBool: boolean
		entityToMove: CanvasEntity
		// isMovingExistingEntity: boolean
	}
	cursor: CursorType
	transformedPoint: Point

	// singleToMove
}
/*export type CanvasRenderOptions = {
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
 selectionBox?: {
 x: number
 y: number
 width: number
 height: number
 }
 creationBox?: {
 x: number
 y: number
 width: number
 height: number
 spots: SpotInBox[]
 }
 nearby?: {
 axisPreviewRect: CompleteEntityBounds
 mouseBounds: CompleteEntityBounds
 closestEntity: NearbyEntity
 snapToGridBool: boolean
 entityToMove: CanvasEntity
 // isMovingExistingEntity: boolean
 }

 // singleToMove
 }*/

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
