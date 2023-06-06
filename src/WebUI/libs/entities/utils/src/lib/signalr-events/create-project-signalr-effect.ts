import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { ProjectsSignalrService } from '@entities/data-access'
import { map, tap } from 'rxjs'
import { GetActionParametersByAction } from '@shared/utils'
import { ProjectId, SignalrEventRequest } from '@entities/shared'
import { createAction } from '@ngrx/store'
import { injectCurrentProject } from '../projects'

type Action = ReturnType<typeof createAction>
export const createProjectSignalrEffect = <TAction extends Action>(
	action: TAction,
	mapFn: (
		action: GetActionParametersByAction<TAction>,
		projectId: ProjectId,
	) => Omit<SignalrEventRequest, 'timeStamp'>,
) =>
	createEffect(
		(
			actions$ = inject(Actions),
			projectsSignalr = inject(ProjectsSignalrService),
			projectGetter = injectCurrentProject(),
		) => {
			return actions$.pipe(
				ofType(action),
				map((actionResult) => {
					const project = projectGetter()
					// * If there is no project, then we don't need to invoke the signalr event
					// * User is not logged in
					if (!project) return undefined
					const params = actionResult as GetActionParametersByAction<TAction>
					return mapFn(params, project.id)
				}),
				tap((request) => {
					if (!request) return
					projectsSignalr.invokeSignalrEvent(request)
				}),
			)
		},
		{ functional: true, dispatch: false },
	)
