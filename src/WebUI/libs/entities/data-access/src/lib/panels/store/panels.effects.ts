import { injectSelectedStore, SelectedActions } from '@canvas/selected/data-access'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions } from './panels.actions'
import { map } from 'rxjs'
import { calculateLinkLinesBetweenTwoPanelCenters } from '@entities/utils'
import { injectPanelLinksStore, PanelLinksActions } from '../../panel-links'
import { assertNotNull } from '@shared/utils'
import { injectPanelsStore } from './panels.store'
import { ProjectsActions } from '../../projects'
import { PanelId, UNDEFINED_STRING_NAME } from '@entities/shared'
import { StringsActions } from '../../strings'

export const panelsStoreInitialized$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(PanelsActions.loadPanels),
			map(() => {
				return ProjectsActions.projectEntityStoreInitialized({
					store: 'panels',
				})
			}),
		)
	},
	{ functional: true },
)

export const updatePanelsFromCreatingString$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(StringsActions.addStringWithPanels),
			map(({ panelUpdates }) => {
				return PanelsActions.updateManyPanelsWithString({
					updates: panelUpdates,
				})
			}),
		)
	},
	{ functional: true },
)

export const loadUndefinedStringId$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(StringsActions.loadStrings),
			map(({ strings }) => {
				const undefinedStringId = strings.find(
					(string) => string.name === UNDEFINED_STRING_NAME,
				)?.id
				if (!undefinedStringId) return PanelsActions.noop()
				return PanelsActions.setUndefinedStringId({ undefinedStringId })
			}),
		)
	},
	{ functional: true },
)

/*export const panelsStoreToClear$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(ProjectsActions.selectProject),
 map(() => {
 return PanelsActions.clearPanelsState()
 }),
 )
 },
 { functional: true },
 )

 export const panelsStoreCleared$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(PanelsActions.clearPanelsState),
 map(() => {
 return ProjectsActions.projectEntityStoreCleared({
 store: 'panels',
 })
 }),
 )
 },
 { functional: true },
 )*/
export const removeSelectedIfDeleted$ = createEffect(
	(actions$ = inject(Actions), selectedStore = injectSelectedStore()) => {
		return actions$.pipe(
			ofType(PanelsActions.deletePanel),
			map(({ panelId }) => {
				const selected = selectedStore.select.singleSelectedPanelId()
				if (selected === panelId) {
					return SelectedActions.clearSingleSelected()
				}
				const multiSelectedIds = selectedStore.select.multipleSelectedPanelIds()
				if (multiSelectedIds.includes(panelId)) {
					return SelectedActions.removePanelsFromMultiSelect({ panelIds: [panelId] })
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
				const linkForPanel = panelLinksStore.select.getByPanelId(update.id as PanelId)
				if (linkForPanel.length === 0) {
					return PanelLinksActions.noop()
				}
				const updates = linkForPanel.map((panelLink) => {
					const positivePanel = panelsStore.select.getById(panelLink.positivePanelId)
					assertNotNull(positivePanel)
					const negativePanel = panelsStore.select.getById(panelLink.negativePanelId)
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
				const panelIds = updatesWithLocation.map((update) => update.id) as PanelId[]
				const linksForPanels = panelLinksStore.select.getByPanelIds(panelIds)
				const updatedLinks = linksForPanels.map((panelLink) => {
					const positivePanel = panelsStore.select.getById(panelLink.positivePanelId)
					assertNotNull(positivePanel)
					const negativePanel = panelsStore.select.getById(panelLink.negativePanelId)
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
