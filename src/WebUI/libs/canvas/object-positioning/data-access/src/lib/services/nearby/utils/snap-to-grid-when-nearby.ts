import { CompleteEntityBounds, NearbyEntity } from '@shared/data-access/models'

export const handleSnapToGridWhenNearby = (
	ctx: CanvasRenderingContext2D,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	snapToGridBool: boolean,
) => {
	if (snapToGridBool) {
		ctx.save()
		ctx.rect(
			axisPreviewRect.left,
			axisPreviewRect.top,
			axisPreviewRect.width,
			axisPreviewRect.height,
		)
		ctx.restore()
		return
	}
	ctx.rect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
}
