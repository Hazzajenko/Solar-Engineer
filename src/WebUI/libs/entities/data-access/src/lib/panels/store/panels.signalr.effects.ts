import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions } from './panels.actions'
import { map, tap } from 'rxjs'
import { CreateManyPanelsSignalrRequest, CreatePanelSignalrRequest, DeleteManyPanelsSignalrRequest, DeletePanelSignalrRequest, SIGNALR_EVENT_ACTION, SIGNALR_EVENT_MODEL, SignalrEventRequest, UpdateManyPanelsSignalrRequest, UpdatePanelSignalrRequest } from '@entities/shared'
import { ProjectsSignalrService } from '../../projects'
import { assertNotNull, newGuidT } from '@shared/utils'
import { createProjectSignalrEffect, injectCurrentProject, injectSelectedStringId } from '@entities/utils'

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

export const addPanelSignalr$ = createProjectSignalrEffect(
	PanelsActions.addPanel,
	({ panel }, projectId) => {
		const request: CreatePanelSignalrRequest = {
			projectId,
			panel,
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.CREATE,
			model: SIGNALR_EVENT_MODEL.PANEL,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

/*export const addPanelSignalr$ = createEffect(
 (
 actions$ = inject(Actions),
 projectsSignalr = inject(ProjectsSignalrService),
 projectGetter = injectCurrentProject(),
 ) => {
 return actions$.pipe(
 ofType(PanelsActions.addPanel),
 map(({ panel }) => {
 const project = projectGetter()
 assertNotNull(project)
 const request: Omit<SignalrEventRequest, 'timeStamp'> = {
 requestId: newGuidT(),
 projectId: project.id,
 action: SIGNALR_EVENT_ACTION.CREATE,
 model: SIGNALR_EVENT_MODEL.PANEL,
 data: JSON.stringify(addProjectId(project, panel)),
 }
 return request
 }),
 tap((request) => projectsSignalr.invokeSignalrEvent(request)),
 )
 },
 { functional: true, dispatch: false },
 )*/

export const addManyPanelsSignalr$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsSignalr = inject(ProjectsSignalrService),
		projectGetter = injectCurrentProject(),
		selectedStringIdGetter = injectSelectedStringId(),
	) => {
		return actions$.pipe(
			ofType(PanelsActions.addManyPanels),
			map(({ panels }) => {
				const project = projectGetter()
				assertNotNull(project)
				const selectedStringId = selectedStringIdGetter()
				// const withProjectId = addProjectId(project, panels)
				// const withProjectId2 = addItemsToObject(panels, project.id)
				// const withSelectedStringId = addItemsToObject(panels, selectedStringId, project.id)
				const minimalPanels = panels.map((panel) => ({
					id: panel.id,
					location: panel.location,
				}))
				const toJsonRequest: CreateManyPanelsSignalrRequest = {
					projectId: project.id,
					panels: minimalPanels,
					panelConfigId: panels[0].panelConfigId,
					angle: panels[0].angle,
					stringId: selectedStringId, // panelConfigId
				}
				/*				const toJson = addProjectIdAndStringIdToArray(
		 panels,
		 'panels',
		 project.id,
		 selectedStringId,
		 )*/
				const request: Omit<SignalrEventRequest, 'timeStamp'> = {
					requestId: newGuidT(),
					projectId: project.id,
					action: SIGNALR_EVENT_ACTION.CREATE_MANY,
					model: SIGNALR_EVENT_MODEL.PANEL,
					data: JSON.stringify(toJsonRequest), // data: JSON.stringify(addProjectId(project, panels)),
				}
				return request
			}),
			tap((request) => projectsSignalr.invokeSignalrEvent(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const updatePanelSignalr$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsSignalr = inject(ProjectsSignalrService),
		projectGetter = injectCurrentProject(),
	) => {
		return actions$.pipe(
			ofType(PanelsActions.updatePanel),
			map(({ update }) => {
				const project = projectGetter()
				assertNotNull(project)
				const toJsonRequest: UpdatePanelSignalrRequest = {
					projectId: project.id,
					update, // panelConfigId
				}
				const request: Omit<SignalrEventRequest, 'timeStamp'> = {
					requestId: newGuidT(),
					projectId: project.id,
					action: SIGNALR_EVENT_ACTION.UPDATE,
					model: SIGNALR_EVENT_MODEL.PANEL,
					data: JSON.stringify(toJsonRequest),
				}
				return request
			}),
			tap((request) => projectsSignalr.invokeSignalrEvent(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const updateManyPanelsSignalr$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsSignalr = inject(ProjectsSignalrService),
		projectGetter = injectCurrentProject(),
	) => {
		return actions$.pipe(
			ofType(PanelsActions.updateManyPanels),
			map(({ updates }) => {
				const project = projectGetter()
				assertNotNull(project)
				const toJsonRequest: UpdateManyPanelsSignalrRequest = {
					projectId: project.id,
					updates, // panelConfigId
				}
				const request: Omit<SignalrEventRequest, 'timeStamp'> = {
					requestId: newGuidT(),
					projectId: project.id,
					action: SIGNALR_EVENT_ACTION.UPDATE_MANY,
					model: SIGNALR_EVENT_MODEL.PANEL,
					data: JSON.stringify(toJsonRequest),
				}
				return request
			}),
			tap((request) => projectsSignalr.invokeSignalrEvent(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const deletePanelSignalr$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsSignalr = inject(ProjectsSignalrService),
		projectGetter = injectCurrentProject(),
	) => {
		return actions$.pipe(
			ofType(PanelsActions.deletePanel),
			map(({ panelId }) => {
				const project = projectGetter()
				assertNotNull(project)
				const toJsonRequest: DeletePanelSignalrRequest = {
					projectId: project.id,
					panelId, // panelConfigId
				}
				const request: Omit<SignalrEventRequest, 'timeStamp'> = {
					requestId: newGuidT(),
					projectId: project.id,
					action: SIGNALR_EVENT_ACTION.DELETE,
					model: SIGNALR_EVENT_MODEL.PANEL,
					data: JSON.stringify(toJsonRequest),
				}
				return request
			}),
			tap((request) => projectsSignalr.invokeSignalrEvent(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const deleteManyPanelsSignalr$ = createProjectSignalrEffect(
	PanelsActions.deleteManyPanels,
	({ panelIds }, projectId) => {
		const toJsonRequest: DeleteManyPanelsSignalrRequest = {
			projectId,
			panelIds, // panelConfigId
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.DELETE_MANY,
			model: SIGNALR_EVENT_MODEL.PANEL,
			data: JSON.stringify(toJsonRequest),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

/*
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
 */
