import {
	PANEL_MODEL,
	PanelId,
	PanelModel,
	SIGNALR_EVENT_ACTION,
	SignalrEventRequest,
} from '@entities/shared'
import { PanelsActions } from '../../../panels'
import { z } from 'zod'
import { mapArrayToUpdateStr } from '@shared/utils'

export function handlePanelSignalrEvent(signalrEvent: SignalrEventRequest) {
	switch (signalrEvent.action) {
		case SIGNALR_EVENT_ACTION.CREATE:
			return handleCreatePanel(signalrEvent)
		case SIGNALR_EVENT_ACTION.CREATE_MANY:
			return handleCreateMany(signalrEvent)
		case SIGNALR_EVENT_ACTION.UPDATE:
			return handleUpdatePanel(signalrEvent)
		case SIGNALR_EVENT_ACTION.UPDATE_MANY:
			return handleUpdateManyPanels(signalrEvent)
		case SIGNALR_EVENT_ACTION.DELETE:
			return handleDeletePanel(signalrEvent)
		case SIGNALR_EVENT_ACTION.DELETE_MANY:
			return handleDeleteManyPanels(signalrEvent)
		default:
			throw new Error('Invalid signalr event type')
	}
}

function handleCreatePanel(signalrEvent: SignalrEventRequest) {
	const panel = parsePanel(signalrEvent.data)
	return PanelsActions.addPanelNoSignalr({ panel })
}

function handleCreateMany(signalrEvent: SignalrEventRequest) {
	const panels = parsePanelArray(signalrEvent.data)
	return PanelsActions.addManyPanelsNoSignalr({ panels })
}

function handleUpdatePanel(signalrEvent: SignalrEventRequest) {
	const panel = parsePanel(signalrEvent.data)
	return PanelsActions.updatePanelNoSignalr({
		update: {
			id: panel.id,
			changes: panel,
		},
	})
}

function handleUpdateManyPanels(signalrEvent: SignalrEventRequest) {
	const panels = parsePanelArray(signalrEvent.data)
	const updates = mapArrayToUpdateStr(panels)
	return PanelsActions.updateManyPanelsNoSignalr({ updates })
}

function handleDeletePanel(signalrEvent: SignalrEventRequest) {
	const panelId = parsePanelId(signalrEvent.data)
	return PanelsActions.deletePanelNoSignalr({ panelId })
}

function handleDeleteManyPanels(signalrEvent: SignalrEventRequest) {
	const panelIds = parsePanelIdArray(signalrEvent.data)
	return PanelsActions.deleteManyPanelsNoSignalr({ panelIds })
}

const parsePanel = (data: string): PanelModel => {
	const parsed = PANEL_MODEL.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	return parsed.data as PanelModel
}

const parsePanelArray = (data: string): PanelModel[] => {
	const parsed = PANEL_MODEL.array().safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	return parsed.data as PanelModel[]
}

const parsePanelId = (data: string): PanelId => {
	const parsed = z
		.object({
			id: z.string(),
		})
		.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	const idWrapper = parsed.data as {
		id: PanelId
	}
	return idWrapper.id
}

const parsePanelIdArray = (data: string): PanelId[] => {
	const parsed = z
		.object({
			id: z.string(),
		})
		.array()
		.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	const idWrappers = parsed.data as {
		id: PanelId
	}[]
	return idWrappers.map((w) => w.id)
}
