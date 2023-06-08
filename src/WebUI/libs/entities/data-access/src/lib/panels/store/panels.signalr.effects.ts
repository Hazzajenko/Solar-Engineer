import { PanelsActions } from './panels.actions'
import {
	CreateManyPanelsSignalrRequest,
	CreatePanelSignalrRequest,
	DeleteManyPanelsSignalrRequest,
	DeletePanelSignalrRequest,
	SIGNALR_EVENT_ACTION,
	SIGNALR_EVENT_MODEL,
	SignalrEventRequest,
	UpdateManyPanelsSignalrRequest,
	UpdatePanelSignalrRequest,
} from '@entities/shared'
import { newGuidT } from '@shared/utils'
import { createProjectSignalrEffect } from '@entities/utils'

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

export const addManyPanelsSignalr$ = createProjectSignalrEffect(
	PanelsActions.addManyPanels,
	({ panels }, projectId) => {
		const minimalPanels = panels.map((panel) => ({
			id: panel.id,
			location: panel.location,
		}))
		const request: CreateManyPanelsSignalrRequest = {
			projectId,
			panels: minimalPanels,
			panelConfigId: panels[0].panelConfigId,
			angle: panels[0].angle,
			stringId: panels[0].stringId,
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.CREATE_MANY,
			model: SIGNALR_EVENT_MODEL.PANEL,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const updatePanelSignalr$ = createProjectSignalrEffect(
	PanelsActions.updatePanel,
	({ update }, projectId) => {
		const toJsonRequest: UpdatePanelSignalrRequest = {
			projectId: projectId,
			update,
		}
		return {
			requestId: newGuidT(),
			projectId: projectId,
			action: SIGNALR_EVENT_ACTION.UPDATE,
			model: SIGNALR_EVENT_MODEL.PANEL,
			data: JSON.stringify(toJsonRequest),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const updateManyPanelsSignalr$ = createProjectSignalrEffect(
	PanelsActions.updateManyPanels,
	({ updates }, projectId) => {
		const toJsonRequest: UpdateManyPanelsSignalrRequest = {
			projectId: projectId,
			updates,
		}
		return {
			requestId: newGuidT(),
			projectId: projectId,
			action: SIGNALR_EVENT_ACTION.UPDATE_MANY,
			model: SIGNALR_EVENT_MODEL.PANEL,
			data: JSON.stringify(toJsonRequest),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const deletePanelSignalr$ = createProjectSignalrEffect(
	PanelsActions.deletePanel,
	({ panelId }, projectId) => {
		const toJsonRequest: DeletePanelSignalrRequest = {
			projectId: projectId,
			panelId,
		}
		return {
			requestId: newGuidT(),
			projectId: projectId,
			action: SIGNALR_EVENT_ACTION.DELETE,
			model: SIGNALR_EVENT_MODEL.PANEL,
			data: JSON.stringify(toJsonRequest),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const deleteManyPanelsSignalr$ = createProjectSignalrEffect(
	PanelsActions.deleteManyPanels,
	({ panelIds }, projectId) => {
		const toJsonRequest: DeleteManyPanelsSignalrRequest = {
			projectId,
			panelIds,
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
