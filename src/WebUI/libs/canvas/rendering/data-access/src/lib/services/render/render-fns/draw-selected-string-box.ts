// import { EntityStoreService } from '../../entities'

import { assertNotNull } from '@shared/utils'
import { getCompleteBoundsFromMultipleEntitiesWithPadding } from '@canvas/utils'
import { CANVAS_COLORS, CanvasPanel, CanvasString } from '@entities/shared'
import { EntityStoreService, StringStatStrings } from '@entities/data-access'
// import { SelectedStateSnapshot } from '../../../../../../deprecated/design-app/feature-design-canvas/src/lib/services/canvas-client-state/+xstate/selected-state.machine'

/*export const drawSelectedStringBox = (
 ctx: CanvasRenderingContext2D,
 selectedSnapshot: SelectedStateSnapshot,
 entityStore: EntityStoreService,
 ) => {
 const selectedStringId = selectedSnapshot.context.selectedStringId
 assertNotNull(selectedStringId)
 const string = entityStore.strings.getById(selectedStringId)
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
	selectedStringId: string,
	entityStore: EntityStoreService,
) => {
	assertNotNull(selectedStringId)
	const string = entityStore.strings.getById(selectedStringId)
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
	selectedString: CanvasString,
	selectedStringPanels: CanvasPanel[],
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
	selectedString: CanvasString,
	selectedStringPanels: CanvasPanel[],
	stringStats: StringStatStrings,
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
	const text = `${selectedString.name} || ${selectedStringPanels.length} panels`
	// const text = `${linkIndex + 1}`
	const metrics = ctx.measureText(text)
	const metricsHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
	// const x = 0 - metrics.width / 2
	// const y = fontSize / 4
	// ctx.font = '10px Consolas, sans-serif'
	// const text = `${selectedString.name} || ${selectedStringPanels.length} panels`
	ctx.measureText(text)
	ctx.fillStyle = 'black'
	ctx.fillText(text, left, top - 2)
	const statsTextLines = [
		`VOC: ${stringStats.totalVoc}`,
		`VMP: ${stringStats.totalVmp}`,
		`ISC: ${stringStats.totalIsc}`,
		`IMP: ${stringStats.totalImp}`,
		`PMAX: ${stringStats.totalPmax}`,
	]
	statsTextLines.forEach((line, index) => {
		ctx.fillText(line, right + 10, top + index * 12 + metricsHeight)
	})
	/*	const statsText = `
	 VOC: ${stringStats.totalVoc}
	 VMP: ${stringStats.totalVmp}
	 ISC: ${stringStats.totalIsc}
	 IMP: ${stringStats.totalImp}
	 PMAX: ${stringStats.totalPmax}
	 `
	 ctx.fillText(statsText, right + 10, top - 2)*/
	// const statsText = `Stats: ${stringStats[selectedString.id].length} strings, ${stringStats[selectedString.id].length} panels`

	ctx.restore()
}
