/*export const updatePanelLinkLinesOnChange$ = createEffect(
 (
 actions$ = inject(Actions),
 _panelLinks = inject(PanelLinksService),
 _selectedStore = injectSelectedStore(),
 ) => {
 return actions$.pipe(
 ofType(...getAllActions(PanelsActions), ...getAllActions(PanelLinksActions)),
 tap(() => {
 if (_selectedStore.selectedStringId) {
 _panelLinks.updateSelectedStringLinkLines()
 }
 }),
 )
 },
 { functional: true, dispatch: false },
 )*/

import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map } from 'rxjs'
import { injectPanelLinksStore, PanelLinksActions, PanelsActions, prepareStringCircuitChainForRender } from '@entities/data-access'
import { StringCircuit } from '@entities/shared'
import { getAllActions } from '@shared/utils'
import { injectSelectedStore } from '@canvas/selected/data-access'

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
				PanelLinksActions.updatePanelLink,
				PanelLinksActions.updateManyPanelLinks,
				PanelLinksActions.deletePanelLink, // PanelLinksActions.deletePanelLink,
				// PanelLinksActions.removePanelLink,
				// PanelLinksActions.updatePanelLink,
				// ...getAllActionsExcept(PanelLinksActions, ['setSelectedStringCircuit', 'noop']),
			), // ofType(...getAllActions(PanelsActions), ...getAllActions(PanelLinksActions)),
			map(() => {
				const selectedStringId = _selectedStore.selectedStringId
				if (!selectedStringId) {
					return PanelLinksActions.noop()
					// return
				}
				const panelLinks = _panelLinksStore.getByStringId(selectedStringId)
				const selectedStringCircuit: StringCircuit = prepareStringCircuitChainForRender(panelLinks)
				return PanelLinksActions.setSelectedStringCircuit({
					selectedStringCircuit,
				})
			}),
		)
	},
	{ functional: true },
)
/*

 const updateSelectedStringLinkLines = () => {
 const selectedStringId = this._selectedStringId()
 if (!selectedStringId) {
 return
 }
 const panelLinks = this._panelLinksStore.getByStringId(selectedStringId)
 this._selectedStringPanelLinks.set(panelLinks)
 const stringCircuitChains = prepareStringPanelLinkCircuitChain(panelLinks) as StringCircuitChains
 this._selectedStringCircuitChains.set(stringCircuitChains)
 const stringCircuitChain = preparePanelLinksForRender(stringCircuitChains)
 this._selectedStringLinkToLinesTuple.set(stringCircuitChain)
 }
 */
