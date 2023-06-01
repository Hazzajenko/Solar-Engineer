import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions } from './panels.actions'
import { map, tap } from 'rxjs'
import {
	CreateManyPanelsRequest,
	CreatePanelRequest,
	DeleteManyPanelsRequest,
	DeletePanelRequest,
	UpdateManyPanelsRequest,
	UpdatePanelRequest,
} from '@entities/shared'
import { PanelsSignalrService } from '@entities/data-access'

export const addPanelSignalr$ = createEffect(
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
)
