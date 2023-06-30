import {
	CreateStringSignalrRequest,
	DeleteStringSignalrRequest,
	PROJECT_ENTITY_MODEL,
	SIGNALR_EVENT_ACTION,
	SignalrEventRequest,
	UpdateStringSignalrRequest,
} from '@entities/shared'
import { newGuidT } from '@shared/utils'
import { createProjectSignalrEffect } from '@entities/utils'
import { StringsActions } from './strings.actions'

export const addStringSignalr$ = createProjectSignalrEffect(
	StringsActions.addString,
	({ string }, projectId) => {
		const request: CreateStringSignalrRequest = {
			projectId,
			string,
			panelIds: [], // panelUpdates: [],
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.CREATE,
			model: PROJECT_ENTITY_MODEL.STRING,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const addStringWithPanelsSignalr$ = createProjectSignalrEffect(
	StringsActions.addStringWithPanels,
	({ string, panelUpdates }, projectId) => {
		const panelIds = panelUpdates.map((p) => p.id)
		const request: CreateStringSignalrRequest = {
			projectId,
			string,
			panelIds,
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.CREATE,
			model: PROJECT_ENTITY_MODEL.STRING,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const updateStringSignalr$ = createProjectSignalrEffect(
	StringsActions.updateString,
	({ update }, projectId) => {
		const request: UpdateStringSignalrRequest = {
			projectId,
			update,
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.UPDATE,
			model: PROJECT_ENTITY_MODEL.STRING,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const deleteStringSignalr$ = createProjectSignalrEffect(
	StringsActions.deleteString,
	({ stringId }, projectId) => {
		const request: DeleteStringSignalrRequest = {
			projectId,
			stringId,
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.DELETE,
			model: PROJECT_ENTITY_MODEL.STRING,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)
