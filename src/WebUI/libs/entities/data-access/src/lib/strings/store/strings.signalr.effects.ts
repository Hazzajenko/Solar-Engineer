import {
	CreateStringSignalrRequest,
	DeleteStringSignalrRequest,
	SIGNALR_EVENT_ACTION,
	SIGNALR_EVENT_MODEL,
	SignalrEventRequest,
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
			panelUpdates: [],
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.CREATE,
			model: SIGNALR_EVENT_MODEL.STRING,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)

export const addStringWithPanelsSignalr$ = createProjectSignalrEffect(
	StringsActions.addStringWithPanels,
	({ string, panelUpdates }, projectId) => {
		const request: CreateStringSignalrRequest = {
			projectId,
			string,
			panelUpdates,
		}
		return {
			requestId: newGuidT(),
			projectId,
			action: SIGNALR_EVENT_ACTION.CREATE,
			model: SIGNALR_EVENT_MODEL.STRING,
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
			action: SIGNALR_EVENT_ACTION.CREATE,
			model: SIGNALR_EVENT_MODEL.STRING,
			data: JSON.stringify(request),
		} as Omit<SignalrEventRequest, 'timeStamp'>
	},
)
