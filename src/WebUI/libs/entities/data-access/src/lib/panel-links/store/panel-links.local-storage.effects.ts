import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelLinksActions } from './panel-links.actions'
import { map } from 'rxjs'
import { ProjectsActions } from '../../projects'
import { createProjectLocalStorageEffect$ } from '@entities/utils'

export const initPanelLinksLocalStorage$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ProjectsActions.initLocalStorageProject),
			map(({ localStorageProject }) => {
				return PanelLinksActions.loadLocalStoragePanelLinks({
					panelLinks: localStorageProject.panelLinks,
				})
			}),
		)
	},
	{ functional: true },
)

export const addPanelLinkLocalStorage$ = createProjectLocalStorageEffect$(
	PanelLinksActions.addPanelLink,
)
export const addManyPanelLinksLocalStorage$ = createProjectLocalStorageEffect$(
	PanelLinksActions.addManyPanelLinks,
)
export const updatePanelLinkLocalStorage$ = createProjectLocalStorageEffect$(
	PanelLinksActions.updatePanelLink,
)
export const updateManyPanelLinksLocalStorage$ = createProjectLocalStorageEffect$(
	PanelLinksActions.updateManyPanelLinks,
)

export const deletePanelLinkLocalStorage$ = createProjectLocalStorageEffect$(
	PanelLinksActions.deletePanelLink,
)

export const deleteManyPanelLinksLocalStorage$ = createProjectLocalStorageEffect$(
	PanelLinksActions.deleteManyPanelLinks,
)
