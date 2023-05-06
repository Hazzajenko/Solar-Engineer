import { SelectedStateContext } from '../selected'
import { EntityNgrxStoreService } from './entity-ngrx-store.service'
import { EntityStoreService } from './entity-store.service'
import { CanvasPanel, TransformedPoint } from '@design-app/shared'
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
export const getSelectedStringPanelBoundsByStringId = (
	store: EntityStoreService,
	selectedStringId: string,
) => {
	assertNotNull(selectedStringId)
	const selectedStringPanels = store.panels.getEntitiesByStringId(selectedStringId)
	return getCompleteBoundsFromMultipleEntitiesWithPadding(selectedStringPanels, 10)
}

export const isPointInsideSelectedStringPanelsByStringId = (
	store: EntityStoreService,
	selectedStringId: string,
	point: TransformedPoint,
) => {
	const selectedPanelBounds = getSelectedStringPanelBoundsByStringId(store, selectedStringId)
	return isPointInsideBounds(point, selectedPanelBounds)
}

export const isPointInsideSelectedStringPanelsByStringIdNgrx = (
	store: EntityNgrxStoreService,
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
	store: EntityNgrxStoreService,
	selectedStringId: string,
) => {
	assertNotNull(selectedStringId)
	const selectedStringPanels = store.panels.panelsByStringIdMap().get(selectedStringId) ?? []
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