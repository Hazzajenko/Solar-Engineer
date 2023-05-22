import { SelectedActions, SelectedStoreService } from '@canvas/selected/data-access'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions } from './panels.actions'
import { map } from 'rxjs'
import { calculateLinkLinesBetweenTwoPanelCenters } from '@entities/utils'
import { injectPanelLinksStore, PanelLinksActions } from '../../panel-links'
import { assertNotNull } from '@shared/utils'
import { injectPanelsStore } from './panels.store'

/*export const removeSelectedIfDeleted$ = createEffect(
 (actions$ = inject(Actions), store = inject(Store)) => {
 return actions$.pipe(
 ofType(PanelsActions.deletePanel),
 map(({ panelId }) => {
 // const selected = store.selectSignal(state => state.selected.singleSelectedEntityId)
 const selected = selectedStore.singleSelectedEntityId
 if (selected === panelId) {
 return SelectedActions.clearSingleSelected()
 }
 const multiSelectedIds = selectedStore.multipleSelectedEntityIds
 if (multiSelectedIds.includes(panelId)) {
 return SelectedActions.removeEntitiesFromMultiSelect({ entityIds: [panelId] })
 }
 return SelectedActions.noop()
 }),
 )
 },
 { functional: true },
 )*/

export const removeSelectedIfDeleted$ = createEffect(
	(actions$ = inject(Actions), selectedStore = inject(SelectedStoreService)) => {
		return actions$.pipe(
			ofType(PanelsActions.deletePanel),
			map(({ panelId }) => {
				const selected = selectedStore.singleSelectedEntityId
				if (selected === panelId) {
					return SelectedActions.clearSingleSelected()
				}
				const multiSelectedIds = selectedStore.multipleSelectedEntityIds
				if (multiSelectedIds.includes(panelId)) {
					return SelectedActions.removeEntitiesFromMultiSelect({ entityIds: [panelId] })
				}
				return SelectedActions.noop()
			}),
		)
	},
	{ functional: true },
)

// todo recalculate panel link paths when updating location
// calculateLinkLinesBetweenTwoPanels(requestingPanel, panel),
export const updatePanelLinkPaths$ = createEffect(
	(
		actions$ = inject(Actions),
		panelLinksStore = injectPanelLinksStore(),
		panelsStore = injectPanelsStore(),
	) => {
		return actions$.pipe(
			ofType(PanelsActions.updatePanel),
			map(({ update }) => {
				if (!update.changes.location) {
					return PanelLinksActions.noop()
				}
				const linkForPanel = panelLinksStore.getByPanelId(update.id)
				const updates = linkForPanel.map((panelLink) => {
					const positivePanel = panelsStore.getById(panelLink.positivePanelId)
					assertNotNull(positivePanel)
					const negativePanel = panelsStore.getById(panelLink.negativePanelId)
					assertNotNull(negativePanel)
					const linePoints = calculateLinkLinesBetweenTwoPanelCenters(positivePanel, negativePanel)
					return { id: panelLink.id, changes: { linePoints } }
				})

				return PanelLinksActions.updateManyPanelLinks({ updates })
			}),
		)
	},
	{ functional: true },
)

export const updateManyPanelLinksPaths$ = createEffect(
	(
		actions$ = inject(Actions),
		panelLinksStore = injectPanelLinksStore(),
		panelsStore = injectPanelsStore(),
	) => {
		return actions$.pipe(
			ofType(PanelsActions.updateManyPanels),
			map(({ updates }) => {
				const updatesWithLocation = updates.filter((update) => update.changes.location)
				if (updatesWithLocation.length === 0) {
					return PanelLinksActions.noop()
				}
				const panelIds = updatesWithLocation.map((update) => update.id)
				const linksForPanels = panelLinksStore.getByPanelIds(panelIds)
				const updatedLinks = linksForPanels.map((panelLink) => {
					const positivePanel = panelsStore.getById(panelLink.positivePanelId)
					assertNotNull(positivePanel)
					const negativePanel = panelsStore.getById(panelLink.negativePanelId)
					assertNotNull(negativePanel)
					const linePoints = calculateLinkLinesBetweenTwoPanelCenters(positivePanel, negativePanel)
					return { id: panelLink.id, changes: { linePoints } }
				})

				return PanelLinksActions.updateManyPanelLinks({ updates: updatedLinks })
			}),
		)
	},
	{ functional: true },
)
