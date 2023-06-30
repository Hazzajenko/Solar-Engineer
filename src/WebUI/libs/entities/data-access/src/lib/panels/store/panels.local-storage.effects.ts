import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions } from './panels.actions'
import { map } from 'rxjs'
import { ProjectsActions } from '../../projects'
import { createProjectLocalStorageEffect$ } from '@entities/utils'

export const initPanelsLocalStorage$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ProjectsActions.initLocalStorageProject),
			map(({ localStorageProject }) => {
				return PanelsActions.loadLocalStoragePanels({
					panels: localStorageProject.panels,
				})
			}),
		)
	},
	{ functional: true },
)

/*export const addPanelLocalStorage$ = createProjectLocalStorageEffect$(
 PanelsActions.addPanel,
 'Panel',
 )*/

export const addPanelLocalStorage$ = createProjectLocalStorageEffect$(PanelsActions.addPanel)
export const addManyPanelsLocalStorage$ = createProjectLocalStorageEffect$(
	PanelsActions.addManyPanels,
)
export const updatePanelLocalStorage$ = createProjectLocalStorageEffect$(PanelsActions.updatePanel)
export const updateManyPanelsLocalStorage$ = createProjectLocalStorageEffect$(
	PanelsActions.updateManyPanels,
)

export const deletePanelLocalStorage$ = createProjectLocalStorageEffect$(PanelsActions.deletePanel)

export const deleteManyPanelsLocalStorage$ = createProjectLocalStorageEffect$(
	PanelsActions.deleteManyPanels,
)

export const updateManyPanelsWithStringLocalStorage$ = createProjectLocalStorageEffect$(
	PanelsActions.updateManyPanelsWithString,
)

/*
 export const addPanelLocalStorage$ = createEffect(
 (
 actions$ = inject(Actions),
 projectsLocalStorage = inject(ProjectsLocalStorageService),
 projectGetter = injectCurrentProject(),
 ) => {
 return actions$.pipe(
 ofType(PanelsActions.addPanel),
 tap(({ panel }) => {
 if (projectGetter()) return
 projectsLocalStorage.addPanel(panel)
 }),
 )
 },
 { functional: true, dispatch: false },
 )
 */
