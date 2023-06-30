import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { ProjectsLocalStorageService } from '@entities/data-access'
import { injectCurrentProject, ProjectLocalStorageAction } from '@entities/utils'
import { map, tap } from 'rxjs'
import { Action } from '@shared/types'

export const createProjectLocalStorageEffect$ = <TAction extends Action>(action: TAction) =>
	createEffect(
		(
			actions$ = inject(Actions),
			projectsLocalStorage = inject(ProjectsLocalStorageService),
			projectGetter = injectCurrentProject(),
		) => {
			return actions$.pipe(
				ofType(action),
				map((actionResult) => {
					// * If there is a project, then we don't need to save to local storage
					if (projectGetter()) return undefined
					return actionResult as ProjectLocalStorageAction
				}),
				tap((request) => {
					// * If there is a project, then we don't need to save to local storage
					if (!request) return
					// projectsLocalStorage.appActionControllerV2(request)
					projectsLocalStorage.appActionController(request)
				}),
			)
		},
		{ functional: true, dispatch: false },
	)
