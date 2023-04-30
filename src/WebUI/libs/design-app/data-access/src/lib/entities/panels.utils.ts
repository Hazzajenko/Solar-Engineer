import { EntityStoreService, SelectedStateContext } from '@design-app/data-access'
import { TransformedPoint } from '@design-app/shared'
import {
	getCompleteBoundsFromMultipleEntitiesWithPadding,
	isPointInsideBounds,
} from '@design-app/utils'
import { assertNotNull } from '@shared/utils'

export const getSelectedStringPanelBounds = (
	store: EntityStoreService,
	selectedCtx: SelectedStateContext,
) => {
	const selectedStringId = selectedCtx.selectedStringId
	assertNotNull(selectedStringId)
	const selectedStringPanels = store.panels.getEntitiesByStringId(selectedStringId)
	return getCompleteBoundsFromMultipleEntitiesWithPadding(selectedStringPanels, 10)
}
export const isPointInsideSelectedStringPanels = (
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
	const selectedPanels = store.panels.getEntitiesByIds(multipleSelectedIds)
	return getCompleteBoundsFromMultipleEntitiesWithPadding(selectedPanels, 10)
}

export const isPointInsideMultipleSelectedPanels = (
	store: EntityStoreService,
	selectedCtx: SelectedStateContext,
	point: TransformedPoint,
) => {
	const multipleSelectedPanelBounds = getMultipleSelectedPanelBounds(store, selectedCtx)
	return isPointInsideBounds(point, multipleSelectedPanelBounds)
}