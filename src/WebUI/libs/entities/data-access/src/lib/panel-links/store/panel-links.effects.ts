import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map } from 'rxjs'
import {
	injectPanelLinksStore,
	PanelLinksActions,
	PanelsActions,
	prepareStringCircuitChainForRender,
	ProjectsActions,
} from '@entities/data-access'
import { StringCircuitWithIndex } from '@entities/shared'
import { getAllActions } from '@shared/utils'
import { injectSelectedStore, SelectedActions } from '@canvas/selected/data-access'

export const panelLinksStoreInitialized$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(PanelLinksActions.loadPanelLinks),
			map(() => {
				return ProjectsActions.projectEntityStoreInitialized({
					store: 'panelLinks',
				})
			}),
		)
	},
	{ functional: true },
)

export const updateSelectedStringCircuitSelectString$ = createEffect(
	(actions$ = inject(Actions), _panelLinksStore = injectPanelLinksStore()) => {
		return actions$.pipe(
			ofType(SelectedActions.selectString),
			map(({ stringId }) => {
				const panelLinks = _panelLinksStore.select.getByStringId(stringId)
				const selectedStringCircuit: StringCircuitWithIndex =
					prepareStringCircuitChainForRender(panelLinks)
				return PanelLinksActions.setSelectedStringCircuit({
					selectedStringCircuit,
				})
			}),
		)
	},
	{ functional: true },
)

export const updateSelectedStringCircuitOnChange$ = createEffect(
	(
		actions$ = inject(Actions),
		_panelLinksStore = injectPanelLinksStore(),
		_selectedStore = injectSelectedStore(),
	) => {
		return actions$.pipe(
			ofType(
				...getAllActions(PanelsActions),
				PanelLinksActions.addPanelLink,
				PanelLinksActions.addPanelLinkNoSignalr,
				PanelLinksActions.updatePanelLink,
				PanelLinksActions.updateManyPanelLinks,
				PanelLinksActions.updateManyPanelLinksNoSignalr,
				PanelLinksActions.deletePanelLink,
				PanelLinksActions.deletePanelLinkNoSignalr,
			),
			map(() => {
				const selectedStringId = _selectedStore.select.selectedStringId()
				if (!selectedStringId) {
					return PanelLinksActions.noop()
				}
				const panelLinks = _panelLinksStore.select.getByStringId(selectedStringId)
				const selectedStringCircuit: StringCircuitWithIndex =
					prepareStringCircuitChainForRender(panelLinks)
				return PanelLinksActions.setSelectedStringCircuit({
					selectedStringCircuit,
				})
			}),
		)
	},
	{ functional: true },
)

/*
 export const setSelectedStringCircuitOnNewPanelLink$ = createEffect(
 (actions$ = inject(Actions), selectedStore = injectSelectedStore()) => {
 return actions$.pipe(
 ofType(PanelLinksActions.addPanelLinkNoSignalr),
 map(({panelLink}) => {
 const selectedStringId = selectedStore.select.selectedStringId()
 if (!selectedStringId) {
 return PanelLinksActions.noop()
 }
 if (selectedStringId === panelLink.stringId) {
 const selectedStringCircuit: StringCircuitWithIndex = prepareStringCircuitChainForRender([panelLink])
 return PanelLinksActions.setSelectedStringCircuit({
 selectedStringCircuit,
 })
 }
 return ProjectsActions.projectEntityStoreInitialized({
 store: 'panelLinks',
 })
 }),
 )
 },
 { functional: true },
 )
 */

/*export const panelLinksStoreToClear$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(ProjectsActions.selectProject),
 map(() => {
 return PanelLinksActions.clearPanelLinksState()
 }),
 )
 },
 { functional: true },
 )

 export const panelLinksStoreCleared$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(PanelLinksActions.clearPanelLinksState),
 map(() => {
 return ProjectsActions.projectEntityStoreCleared({
 store: 'panelLinks',
 })
 }),
 )
 },
 { functional: true },
 )*/
