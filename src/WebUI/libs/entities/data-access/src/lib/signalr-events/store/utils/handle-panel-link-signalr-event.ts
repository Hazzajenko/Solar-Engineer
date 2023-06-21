import {
	PANEL_LINK_MODEL,
	PanelLinkId,
	PanelLinkModel,
	SIGNALR_EVENT_ACTION,
	SignalrEventRequest,
} from '@entities/shared'
import { PanelLinksActions } from '../../../panel-links'
import { z } from 'zod'
import { mapArrayToUpdateStr } from '@shared/utils'

export function handlePanelLinkSignalrEvent(signalrEvent: SignalrEventRequest) {
	switch (signalrEvent.action) {
		case SIGNALR_EVENT_ACTION.CREATE:
			return handleCreatePanelLink(signalrEvent)
		case SIGNALR_EVENT_ACTION.CREATE_MANY:
			return handleCreateMany(signalrEvent)
		case SIGNALR_EVENT_ACTION.UPDATE:
			return handleUpdatePanelLink(signalrEvent)
		case SIGNALR_EVENT_ACTION.UPDATE_MANY:
			return handleUpdateManyPanelLinks(signalrEvent)
		case SIGNALR_EVENT_ACTION.DELETE:
			return handleDeletePanelLink(signalrEvent)
		case SIGNALR_EVENT_ACTION.DELETE_MANY:
			return handleDeleteManyPanelLinks(signalrEvent)
		default:
			throw new Error('Invalid signalr event type')
	}
}

function handleCreatePanelLink(signalrEvent: SignalrEventRequest) {
	const panelLink = parsePanelLink(signalrEvent.data)
	return PanelLinksActions.addPanelLinkNoSignalr({ panelLink })
}

function handleCreateMany(signalrEvent: SignalrEventRequest) {
	const panelLinks = parsePanelLinkArray(signalrEvent.data)
	return PanelLinksActions.addManyPanelLinksNoSignalr({ panelLinks })
}

function handleUpdatePanelLink(signalrEvent: SignalrEventRequest) {
	const panelLink = parsePanelLink(signalrEvent.data)
	return PanelLinksActions.updatePanelLinkNoSignalr({
		update: {
			id: panelLink.id,
			changes: panelLink,
		},
	})
}

function handleUpdateManyPanelLinks(signalrEvent: SignalrEventRequest) {
	const panelLinks = parsePanelLinkArray(signalrEvent.data)
	const updates = mapArrayToUpdateStr(panelLinks)
	return PanelLinksActions.updateManyPanelLinksNoSignalr({ updates })
}

function handleDeletePanelLink(signalrEvent: SignalrEventRequest) {
	const panelLinkId = parsePanelLinkId(signalrEvent.data)
	return PanelLinksActions.deletePanelLinkNoSignalr({ panelLinkId })
}

function handleDeleteManyPanelLinks(signalrEvent: SignalrEventRequest) {
	const panelLinkIds = parsePanelLinkIdArray(signalrEvent.data)
	return PanelLinksActions.deleteManyPanelLinksNoSignalr({ panelLinkIds })
}

const parsePanelLink = (data: string): PanelLinkModel => {
	const parsed = PANEL_LINK_MODEL.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	return parsed.data as PanelLinkModel
}

const parsePanelLinkArray = (data: string): PanelLinkModel[] => {
	const parsed = PANEL_LINK_MODEL.array().safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	return parsed.data as PanelLinkModel[]
}

const parsePanelLinkId = (data: string): PanelLinkId => {
	const parsed = z
		.object({
			id: z.string(),
		})
		.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	const idWrapper = parsed.data as {
		id: PanelLinkId
	}
	return idWrapper.id
}

const parsePanelLinkIdArray = (data: string): PanelLinkId[] => {
	const parsed = z
		.object({
			id: z.string(),
		})
		.array()
		.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	const idWrappers = parsed.data as {
		id: PanelLinkId
	}[]
	return idWrappers.map((w) => w.id)
}
