import { injectSelectedStore } from '@canvas/selected/data-access'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { PanelLinksActions, PanelLinksService } from '../../panel-links'
import { getAllActions } from '@shared/utils'
import { PanelsActions } from '../../panels'

export const updatePanelLinkLinesOnChange$ = createEffect(
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
)
