import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelConfigsActions } from './panel-configs.actions'
import { map } from 'rxjs'
import { ProjectsActions } from '../../projects'
import { createProjectLocalStorageEffect$ } from '@entities/utils'

export const initPanelConfigsLocalStorage$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ProjectsActions.initLocalStorageProject),
			map(({ localStorageProject }) => {
				return PanelConfigsActions.loadLocalStoragePanelConfigs({
					panelConfigs: localStorageProject.panelConfigs,
				})
			}),
		)
	},
	{ functional: true },
)

export const addPanelConfigLocalStorage$ = createProjectLocalStorageEffect$(
	PanelConfigsActions.addPanelConfig,
)
export const addManyPanelConfigsLocalStorage$ = createProjectLocalStorageEffect$(
	PanelConfigsActions.addManyPanelConfigs,
)
export const updatePanelConfigLocalStorage$ = createProjectLocalStorageEffect$(
	PanelConfigsActions.updatePanelConfig,
)
export const updateManyPanelConfigsLocalStorage$ = createProjectLocalStorageEffect$(
	PanelConfigsActions.updateManyPanelConfigs,
)

export const deletePanelConfigLocalStorage$ = createProjectLocalStorageEffect$(
	PanelConfigsActions.deletePanelConfig,
)

export const deleteManyPanelConfigsLocalStorage$ = createProjectLocalStorageEffect$(
	PanelConfigsActions.deleteManyPanelConfigs,
)
