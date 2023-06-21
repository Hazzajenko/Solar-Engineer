import { PanelLinksActions } from './panel-links.actions'
import {
	CreatePanelLinkSignalrRequest,
	DeletePanelLinkSignalrRequest,
	SIGNALR_EVENT_ACTION,
	SIGNALR_EVENT_MODEL,
	SignalrEventRequest,
	UpdateManyPanelLinksSignalrRequest,
} from '@entities/shared'
import { newGuidT } from '@shared/utils'
import { createProjectSignalrEffect } from '@entities/utils'

export const addPanelLinkSignalr$ = createProjectSignalrEffect(
	PanelLinksActions.addPanelLink,
	({ panelLink }, projectId) => {
		const request: CreatePanelLinkSignalrRequest = {
			projectId,
			panelLink,
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.CREATE,
			model: SIGNALR_EVENT_MODEL.PANEL_LINK,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const updateManyPanelLinksSignalr$ = createProjectSignalrEffect(
	PanelLinksActions.updateManyPanelLinks,
	({ updates }, projectId) => {
		const toJsonRequest: UpdateManyPanelLinksSignalrRequest = {
			projectId: projectId,
			updates,
		}
		return {
			requestId: newGuidT(),
			projectId: projectId,
			action: SIGNALR_EVENT_ACTION.UPDATE_MANY,
			model: SIGNALR_EVENT_MODEL.PANEL_LINK,
			data: JSON.stringify(toJsonRequest),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const deletePanelLinkSignalr$ = createProjectSignalrEffect(
	PanelLinksActions.deletePanelLink,
	({ panelLinkId }, projectId) => {
		const toJsonRequest: DeletePanelLinkSignalrRequest = {
			projectId: projectId,
			panelLinkId,
		}
		return {
			requestId: newGuidT(),
			projectId: projectId,
			action: SIGNALR_EVENT_ACTION.DELETE,
			model: SIGNALR_EVENT_MODEL.PANEL_LINK,
			data: JSON.stringify(toJsonRequest),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)
