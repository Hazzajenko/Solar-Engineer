import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions } from './panels.actions'
import { map, tap } from 'rxjs'
import { CreateManyPanelsRequest, DeleteManyPanelsRequest, DeletePanelRequest, SIGNALR_EVENT_ACTION, SIGNALR_EVENT_MODEL, SignalrEventRequest, UpdateManyPanelsRequest, UpdatePanelRequest } from '@entities/shared'
import { PanelsSignalrService } from '../services'
import { ProjectsSignalrService } from '../../projects'
import { assertNotNull, newGuidT } from '@shared/utils'
import { addProjectId, injectCurrentProject } from '@entities/utils'

/*export const addPanelSignalr$ = createEffect(
 (actions$ = inject(Actions), _panelsSignalr = inject(PanelsSignalrService)) => {
 return actions$.pipe(
 ofType(PanelsActions.addPanel),
 map(({ panel }) => {
 const request: CreatePanelRequest = {
 requestId: 'create-panel',
 projectId: 'panel.projectId',
 type: 'CreatePanel',
 payload: panel,
 }
 return request
 }),
 tap((request) => _panelsSignalr.addPanel(request)),
 )
 },
 { functional: true, dispatch: false },
 )*/

export const addPanelSignalr$ = createEffect(
	(
		actions$ = inject(Actions),
		_projectsSignalr = inject(ProjectsSignalrService),
		projectGetter = injectCurrentProject(),
	) => {
		return actions$.pipe(
			ofType(PanelsActions.addPanel),
			map(({ panel }) => {
				const project = projectGetter()
				assertNotNull(project)
				const request: Omit<SignalrEventRequest, 'timeStamp'> = {
					// requestId: newGuid() as RequestId,
					requestId: newGuidT(),
					projectId: project.id,
					action: SIGNALR_EVENT_ACTION.CREATE,
					model: SIGNALR_EVENT_MODEL.PANEL,
					data: JSON.stringify(addProjectId(project, panel)),
				}
				return request
			}),
			tap((request) => _projectsSignalr.invokeSignalrEvent(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const addManyPanelsSignalr$ = createEffect(
	(actions$ = inject(Actions), _panelsSignalr = inject(PanelsSignalrService)) => {
		return actions$.pipe(
			ofType(PanelsActions.addManyPanels),
			map(({ panels }) => {
				const request: CreateManyPanelsRequest = {
					requestId: 'create-panel',
					projectId: 'panel.projectId',
					type: 'CreateManyPanels',
					payload: panels,
				}
				return request
			}),
			tap((request) => _panelsSignalr.addManyPanels(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const updatePanelSignalr$ = createEffect(
	(actions$ = inject(Actions), _panelsSignalr = inject(PanelsSignalrService)) => {
		return actions$.pipe(
			ofType(PanelsActions.updatePanel),
			map(({ update }) => {
				const request: UpdatePanelRequest = {
					requestId: 'create-panel',
					projectId: 'panel.projectId',
					type: 'UpdatePanel',
					payload: update,
				}
				return request
			}),
			tap((request) => _panelsSignalr.updatePanel(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const updateManyPanelsSignalr$ = createEffect(
	(actions$ = inject(Actions), _panelsSignalr = inject(PanelsSignalrService)) => {
		return actions$.pipe(
			ofType(PanelsActions.updateManyPanels),
			map(({ updates }) => {
				const request: UpdateManyPanelsRequest = {
					requestId: 'create-panel',
					projectId: 'panel.projectId',
					type: 'UpdateManyPanels',
					payload: updates,
				}
				return request
			}),
			tap((request) => _panelsSignalr.updateManyPanels(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const deletePanelSignalr$ = createEffect(
	(actions$ = inject(Actions), _panelsSignalr = inject(PanelsSignalrService)) => {
		return actions$.pipe(
			ofType(PanelsActions.deletePanel),
			map(({ panelId }) => {
				const request: DeletePanelRequest = {
					requestId: 'create-panel',
					projectId: 'panel.projectId',
					type: 'DeletePanel',
					payload: panelId,
				}
				return request
			}),
			tap((request) => _panelsSignalr.deletePanel(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const deleteManyPanelsSignalr$ = createEffect(
	(actions$ = inject(Actions), _panelsSignalr = inject(PanelsSignalrService)) => {
		return actions$.pipe(
			ofType(PanelsActions.deleteManyPanels),
			map(({ panelIds }) => {
				const request: DeleteManyPanelsRequest = {
					requestId: 'create-panel',
					projectId: 'panel.projectId',
					type: 'DeleteManyPanels',
					payload: panelIds,
				}
				return request
			}),
			tap((request) => _panelsSignalr.deleteManyPanels(request)),
		)
	},
	{ functional: true, dispatch: false },
)
