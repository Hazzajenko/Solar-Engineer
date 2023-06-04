import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { ProjectsSignalrService } from '@entities/data-access'
import { map, tap } from 'rxjs'
import { assertNotNull, GetActionParametersByAction } from '@shared/utils'
import { ProjectId, SignalrEventRequest } from '@entities/shared'
import { createAction } from '@ngrx/store'
import { injectCurrentProject } from './get-current-project'

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
					assertNotNull(project)
					const params = actionResult as GetActionParametersByAction<TAction>
					return mapFn(params, project.id)
				}),
				tap((request) => projectsSignalr.invokeSignalrEvent(request)),
			)
		},
		{ functional: true, dispatch: false },
	)
/*

 const test = createProjectSignalrEffect(PanelsActions.addPanel, (panel, projectId) => {
 return {
 requestId: newGuidT(),
 projectId: projectId,
 action: SIGNALR_EVENT_ACTION.CREATE,
 model: SIGNALR_EVENT_MODEL.PANEL,
 data: JSON.stringify(panel),
 } as Omit<SignalrEventRequest, 'timeStamp'>
 })
 */
