import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { catchError, map, of, switchMap } from 'rxjs'
import { AuthActions } from '@auth/data-access'
import { ProjectsHttpService } from '../services'
import { ProjectsActions } from './projects.actions'

export const loadUserProjects$ = createEffect(
	(actions$ = inject(Actions), projectsHttp = inject(ProjectsHttpService)) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			switchMap(() => projectsHttp.getUserProjects()),
			map(({ projects }) => {
				return ProjectsActions.loadUserProjectsSuccess({ projects })
			}),
			catchError((error) => of(ProjectsActions.loadUserProjectsFailure({ error }))),
		)
	},
	{ functional: true },
)
