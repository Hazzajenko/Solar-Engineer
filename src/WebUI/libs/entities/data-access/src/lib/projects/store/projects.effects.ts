import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs'
import { AuthActions } from '@auth/data-access'
import { ProjectsHttpService, ProjectsSignalrService } from '../services'
import { ProjectsActions } from './projects.actions'

export const createProject$ = createEffect(
	(actions$ = inject(Actions), projectsHttp = inject(ProjectsHttpService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.createProjectHttp),
			switchMap((request) => projectsHttp.createProject(request)),
			catchError((error: Error) => {
				console.error(error.message)
				return EMPTY
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const initProjectsSignalr$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			tap(({ token }) => projectsSignalr.init(token)),
		)
	},
	{ functional: true, dispatch: false },
)

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
