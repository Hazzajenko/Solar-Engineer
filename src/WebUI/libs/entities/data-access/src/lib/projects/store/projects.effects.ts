import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs'
import { AuthActions } from '@auth/data-access'
import { ProjectsHttpService, ProjectsSignalrService } from '../services'
import { ProjectsActions } from './projects.actions'
import { PanelsSignalrService } from '../../panels'

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
	(
		actions$ = inject(Actions),
		projectsSignalr = inject(ProjectsSignalrService),
		panelsSignalr = inject(PanelsSignalrService),
	) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			tap(({ token }) => {
				const hubConnection = projectsSignalr.init(token)
				panelsSignalr.init(hubConnection)
			}),
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

export const selectUserProjectOnLoad$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.loadUserProjectsSuccess),
			map(({ projects }) => {
				return ProjectsActions.selectProject({ projectId: projects[0].id })
			}),
			tap((action) => projectsSignalr.getProjectById(action.projectId, true)),
		)
	},
	{ functional: true },
)
