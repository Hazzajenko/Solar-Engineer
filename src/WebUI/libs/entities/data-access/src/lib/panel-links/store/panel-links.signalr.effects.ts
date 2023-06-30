import { PanelLinksActions } from './panel-links.actions'
import {
	CreatePanelLinkSignalrRequest,
	DeletePanelLinkSignalrRequest,
	PROJECT_ENTITY_MODEL,
	SIGNALR_EVENT_ACTION,
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
			model: PROJECT_ENTITY_MODEL.PANEL_LINK,
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
			model: PROJECT_ENTITY_MODEL.PANEL_LINK,
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
			model: PROJECT_ENTITY_MODEL.PANEL_LINK,
			data: JSON.stringify(toJsonRequest),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)
