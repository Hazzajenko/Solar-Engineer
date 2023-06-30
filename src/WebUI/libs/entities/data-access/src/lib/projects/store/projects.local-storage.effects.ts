import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map } from 'rxjs'
import { ProjectsActions, ProjectsLocalStorageService } from '@entities/data-access'
import { AuthActions } from '@auth/data-access'

export const initLocalStorageProject$ = createEffect(
	(actions$ = inject(Actions), projectsLocalStorage = inject(ProjectsLocalStorageService)) => {
		return actions$.pipe(
			ofType(AuthActions.signInAsGuest),
			map(() => {
				let localStorageProject = projectsLocalStorage.fetchExistingProject()
				if (!localStorageProject) {
					localStorageProject = projectsLocalStorage.initNewProject()
				}
				return ProjectsActions.initLocalStorageProject({ localStorageProject })
			}),
		)
	},
	{ functional: true },
)
