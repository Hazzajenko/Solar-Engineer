import { assertNotNull } from '@shared/utils'
import { getCompleteBoundsFromMultipleEntitiesWithPadding, isPointInsideBounds } from '@canvas/utils'
import { TransformedPoint } from '@shared/data-access/models'
import { EntityStore } from '@entities/common/data-access'
import { CanvasPanel } from '../types'

/*export const getSelectedStringPanelBounds = (
 store: EntityStoreService,
 selectedCtx: SelectedStateContext,
 ) => {
 const selectedStringId = selectedCtx.selectedStringId
 assertNotNull(selectedStringId)
 const selectedStringPanels = store.panels.getByStringId(selectedStringId)
 return getCompleteBoundsFromMultipleEntitiesWithPadding(selectedStringPanels, 10)
 }*/
export const getSelectedStringPanelBoundsByStringId = (
	store: EntityStore,
	selectedStringId: string,
) => {
	assertNotNull(selectedStringId)
	const selectedStringPanels = store.panels.getByStringId(selectedStringId)
	return getCompleteBoundsFromMultipleEntitiesWithPadding(selectedStringPanels, 10)
}

export const isPointInsideSelectedStringPanelsByStringId = (
	store: EntityStore,
	selectedStringId: string,
	point: TransformedPoint,
) => {
	const selectedPanelBounds = getSelectedStringPanelBoundsByStringId(store, selectedStringId)
	return isPointInsideBounds(point, selectedPanelBounds)
}

export const isPointInsideSelectedStringPanelsByStringIdNgrx = (
	store: EntityStore,
	selectedStringId: string,
	point: TransformedPoint,
) => {
	const selectedPanelBounds = getSelectedStringPanelBoundsByStringIdNgrx(store, selectedStringId)
	return isPointInsideBounds(point, selectedPanelBounds)
}

export const isPointInsideSelectedStringPanelsByStringIdNgrxWithPanels = (
	panels: CanvasPanel[],
	selectedStringId: string,
	point: TransformedPoint,
) => {
	const selectedPanelBounds = getCompleteBoundsFromMultipleEntitiesWithPadding(panels, 10)
	return isPointInsideBounds(point, selectedPanelBounds)
}
export const getSelectedStringPanelBoundsByStringIdNgrx = (
	store: EntityStore,
	selectedStringId: string,
) => {
	assertNotNull(selectedStringId)
	const selectedStringPanels = store.panels.getByStringId(selectedStringId) ?? []
	return getCompleteBoundsFromMultipleEntitiesWithPadding(selectedStringPanels, 10)
}
/*export const isPointInsideSelectedStringPanels = (
 store: EntityStoreService,
 selectedCtx: SelectedStateContext,
 point: TransformedPoint,
 ) => {
 const selectedPanelBounds = getSelectedStringPanelBounds(store, selectedCtx)
 return isPointInsideBounds(point, selectedPanelBounds)
 }
 export const getMultipleSelectedPanelBounds = (
 store: EntityStoreService,
 selectedCtx: SelectedStateContext,
 ) => {
 const multipleSelectedIds = selectedCtx.multipleSelectedIds
 const selectedPanels = store.panels.getByIds(multipleSelectedIds)
 return getCompleteBoundsFromMultipleEntitiesWithPadding(selectedPanels, 10)
 }

 export const isPointInsideMultipleSelectedPanels = (
 store: EntityStoreService,
 selectedCtx: SelectedStateContext,
 point: TransformedPoint,
 ) => {
 const multipleSelectedPanelBounds = getMultipleSelectedPanelBounds(store, selectedCtx)
 return isPointInsideBounds(point, multipleSelectedPanelBounds)
 }*/

export const isTypeOfPanel = (panel: unknown): panel is CanvasPanel => {
	if (!panel) return false
	return (panel as CanvasPanel).type === 'panel'
}
