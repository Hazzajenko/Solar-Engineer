import { EntityStoreService } from '../../entities'
import { SelectedStateSnapshot } from '../../selected'
import { CANVAS_COLORS } from '@design-app/shared'
import { getCompleteBoundsFromMultipleEntitiesWithPadding } from '@design-app/utils'
import { assertNotNull } from '@shared/utils'


export const drawSelectedStringBox = (
	ctx: CanvasRenderingContext2D,
	selectedSnapshot: SelectedStateSnapshot,
	entityStore: EntityStoreService,
) => {
	const selectedStringId = selectedSnapshot.context.selectedStringId
	assertNotNull(selectedStringId)
	const string = entityStore.strings.getEntityById(selectedStringId)
	assertNotNull(string)
	const selectedStringPanels = entityStore.panels.getEntitiesByStringId(selectedStringId)

	const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(
		selectedStringPanels,
		10,
	)

	ctx.save()
	const { left, top, width, height } = selectionBoxBounds
	ctx.strokeStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
	ctx.lineWidth = 1
	ctx.strokeRect(left, top, width, height)
	// ctx.font = '10px Roboto, sans-serif'
	// ctx.font = '10px Helvetica, sans-serif'
	// ctx.font = '10px Cascadia Code, sans-serif'
	ctx.font = '10px Consolas, sans-serif'
	const text = `${string.name} || ${selectedStringPanels.length} panels`
	ctx.fillStyle = 'black'
	ctx.fillText(text, left, top - 2)
	ctx.restore()
}