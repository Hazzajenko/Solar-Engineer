import { CompleteEntityBounds, NearbyEntity } from '@shared/data-access/models'
import { CANVAS_COLORS, CanvasEntity, PANEL_STROKE_STYLE } from '@entities/shared'
import { drawEntity } from '@canvas/rendering/data-access'

export const handleSnapToGridWhenNearby = (
	ctx: CanvasRenderingContext2D,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	snapToGridBool: boolean,
	isMovingExistingEntity: CanvasEntity | undefined,
) => {
	if (snapToGridBool) {
		// ctx.save()
		ctx.rect(
			axisPreviewRect.left,
			axisPreviewRect.top,
			axisPreviewRect.width,
			axisPreviewRect.height,
		)
		// ctx.restore()
		return
	}
	if (isMovingExistingEntity) {
		drawEntity(
			ctx,
			isMovingExistingEntity,
			CANVAS_COLORS.HoveredPanelFillStyle,
			PANEL_STROKE_STYLE.DEFAULT,
		)
		return
	}
	// ctx.save()
	ctx.rect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
}
