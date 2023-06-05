import { assertNotNull } from '@shared/utils'
import { getCompleteBoundsFromMultipleEntitiesWithPadding } from '@canvas/utils'
import { CANVAS_COLORS, PanelModel, StringId, StringModel } from '@entities/shared'
import { EntityStore, StringsStatsService } from '@entities/data-access'
// import { SelectedStateSnapshot } from '../../../../../../deprecated/design-app/feature-design-canvas/src/lib/services/canvas-client-state/+xstate/selected-state.machine'

/*export const drawSelectedStringBox = (
 ctx: CanvasRenderingContext2D,
 selectedSnapshot: SelectedStateSnapshot,
 entityStore: EntityStoreService,
 ) => {
 const selectedStringId = selectedSnapshot.context.selectedStringId
 assertNotNull(selectedStringId)
 const string = entityStore.strings.select.getById(selectedStringId)
 assertNotNull(string)
 const selectedStringPanels = entityStore.panels.getByStringId(selectedStringId)

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
 }*/

export const drawSelectedStringBoxV2 = (
	ctx: CanvasRenderingContext2D,
	selectedStringId: StringId,
	entityStore: EntityStore,
) => {
	assertNotNull(selectedStringId)
	const string = entityStore.strings.select.getById(selectedStringId)
	assertNotNull(string)
	const selectedStringPanels = entityStore.panels.getByStringId(selectedStringId)

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

export const drawSelectedStringBoxV3 = (
	ctx: CanvasRenderingContext2D,
	selectedString: StringModel,
	selectedStringPanels: PanelModel[],
) => {
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
	const text = `${selectedString.name} || ${selectedStringPanels.length} panels`
	ctx.fillStyle = 'black'
	ctx.fillText(text, left, top - 2)
	ctx.restore()
}

export const drawSelectedStringBoxWithStats = (
	ctx: CanvasRenderingContext2D,
	selectedString: StringModel,
	selectedStringPanels: PanelModel[],
	stringStats: ReturnType<StringsStatsService['calculateStringStatsForSelectedString']>, // stringStats: StringStatStrings,
) => {
	const selectionBoxBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(
		selectedStringPanels,
		10,
	)

	ctx.save()
	const { left, top, width, height, right } = selectionBoxBounds
	ctx.strokeStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
	ctx.lineWidth = 1
	ctx.strokeRect(left, top, width, height)
	const fontSize = 10
	ctx.font = `${fontSize}px Consolas, sans-serif`
	const stringNameText = `${selectedString.name} || ${selectedStringPanels.length} panels`
	const metrics = ctx.measureText(stringNameText)
	const stringNameTextHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
	ctx.fillStyle = 'black'
	ctx.fillText(stringNameText, left, top - 2)
	const {
		totalVoc,
		totalVmp,
		totalIsc,
		totalImp,
		totalPmax,
		amountOfChains,
		amountOfLinks,
		panelsWithoutLinks,
	} = stringStats

	const statsTextLines = [
		totalVoc,
		totalVmp,
		totalIsc,
		totalImp,
		totalPmax,
		amountOfChains,
		amountOfLinks,
		panelsWithoutLinks,
	]
	statsTextLines.forEach((line, index) => {
		ctx.fillText(line, right + 10, top + index * 12 + stringNameTextHeight)
	})
	ctx.restore()
}
