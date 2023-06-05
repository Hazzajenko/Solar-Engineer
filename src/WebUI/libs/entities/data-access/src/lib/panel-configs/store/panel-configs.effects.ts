import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map } from 'rxjs'
import { PanelConfigsActions } from './panel-configs.actions'
import { ProjectsActions } from '../../projects'

export const panelConfigsStoreInitialized$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(PanelConfigsActions.loadPanelConfigs),
			map(() => {
				return ProjectsActions.projectEntityStoreInitialized({
					store: 'panelConfigs',
				})
			}),
		)
	},
	{ functional: true },
)
/*

 export const panelConfigsStoreToClear$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(ProjectsActions.selectProject),
 map(() => {
 return PanelConfigsActions.clearPanelConfigsState()
 }),
 )
 },
 { functional: true },
 )

 export const panelConfigsStoreCleared$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(PanelConfigsActions.clearPanelConfigsState),
 map(() => {
 return ProjectsActions.projectEntityStoreCleared({
 store: 'panelConfigs',
 })
 }),
 )
 },
 { functional: true },
 )
 */
