import { CompleteEntityBounds, NearbyEntity } from '@shared/data-access/models'
import { CANVAS_COLORS, CanvasEntity } from '@entities/shared'
import { drawEntityWithConfig } from '@canvas/rendering/data-access'

export const handleSnapToGridWhenNearby = (
	ctx: CanvasRenderingContext2D,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	snapToGridBool: boolean,
	isMovingExistingEntity: CanvasEntity | undefined,
) => {
	if (snapToGridBool) {
		if (isMovingExistingEntity) {
			// console.log('isMovingExistingEntity', isMovingExistingEntity)
			drawEntityWithConfig(ctx, axisPreviewRect, {
				fillStyle: CANVAS_COLORS.HoveredPanelFillStyle,
			})
			return
		}
		// ctx.save()
		// console.log('snapToGridBool', snapToGridBool)
		// ctx.save()
		drawEntityWithConfig(ctx, axisPreviewRect, {
			fillStyle: CANVAS_COLORS.PreviewPanelFillStyle,
			globalAlpha: 0.6,
		})
		// ctx.restore()
		// ctx.rect(axisPreviewRect.left, axisPreviewRect.top, axisPreviewRect.width, axisPreviewRect.height,)
		// ctx.restore()
		return
	}

	if (isMovingExistingEntity) {
		drawEntityWithConfig(ctx, mouseBounds, {
			fillStyle: CANVAS_COLORS.HoveredPanelFillStyle,
		})
		return
	}

	drawEntityWithConfig(ctx, mouseBounds, {
		fillStyle: CANVAS_COLORS.PreviewPanelFillStyle,
		globalAlpha: 0.6,
	})
	/*
	 if (!isMovingExistingEntity) {
	 if (snapToGridBool) {
	 // ctx.save()
	 drawEntityWithConfig(ctx, mouseBounds, {
	 fillStyle: CANVAS_COLORS.PreviewPanelFillStyle,
	 globalAlpha: 0.6,
	 })
	 // ctx.rect(axisPreviewRect.left, axisPreviewRect.top, axisPreviewRect.width, axisPreviewRect.height,)
	 // ctx.restore()
	 return
	 }
	 // render preview creation bounds
	 drawEntityWithConfig(ctx, mouseBounds, {
	 fillStyle: CANVAS_COLORS.PreviewPanelFillStyle,
	 globalAlpha: 0.4,
	 })
	 // drawEntityCreationPreview(ctx, mouseBounds)
	 /!*		ctx.save()
	 ctx.fillStyle = CANVAS_COLORS.PreviewPanelFillStyle
	 ctx.fillRect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
	 ctx.restore()*!/
	 return
	 }
	 if (snapToGridBool) {
	 // ctx.save()
	 drawEntityWithConfig(ctx, axisPreviewRect, {
	 fillStyle: CANVAS_COLORS.DefaultPanelFillStyle,
	 })
	 /!*		ctx.rect(
	 axisPreviewRect.left,
	 axisPreviewRect.top,
	 axisPreviewRect.width,
	 axisPreviewRect.height,
	 )*!/
	 // ctx.restore()
	 return
	 }*/

	/*	if (!isMovingExistingEntity) {
	 // render preview creation bounds
	 drawEntityWithConfig(ctx, mouseBounds, {
	 fillStyle: CANVAS_COLORS.PreviewPanelFillStyle,
	 globalAlpha: 0.4,
	 })
	 // drawEntityCreationPreview(ctx, mouseBounds)
	 /!*		ctx.save()
	 ctx.fillStyle = CANVAS_COLORS.PreviewPanelFillStyle
	 ctx.fillRect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
	 ctx.restore()*!/
	 return
	 }*/
	/*	if (isMovingExistingEntity) {
	 drawEntity(
	 ctx,
	 isMovingExistingEntity,
	 CANVAS_COLORS.HoveredPanelFillStyle,
	 PANEL_STROKE_STYLE.DEFAULT,
	 )
	 return
	 }*/
	// ctx.save()
	// ctx.rect(mouseBounds.left, mouseBounds.top, mouseBounds.width, mouseBounds.height)
}
