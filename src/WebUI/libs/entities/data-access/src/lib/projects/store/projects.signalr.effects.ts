import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { ProjectsSignalrService } from '../services'
import { ProjectsActions } from './projects.actions'

export const updateProjectSignalr$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.updateProject),
			tap(({ update }) => projectsSignalr.updateProject(update)),
		)
	},
	{ functional: true, dispatch: false },
)

export const deleteProjectSignalr$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.deleteProject),
			tap(({ projectId }) => projectsSignalr.deleteProject(projectId)),
		)
	},
	{ functional: true, dispatch: false },
)
