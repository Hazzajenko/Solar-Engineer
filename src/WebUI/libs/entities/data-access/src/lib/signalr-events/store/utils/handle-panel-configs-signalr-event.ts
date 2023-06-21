import {
	PANEL_CONFIG_MODEL,
	PanelConfigId,
	PanelConfigModel,
	SIGNALR_EVENT_ACTION,
	SignalrEventRequest,
} from '@entities/shared'
import { PanelConfigsActions } from '../../../panel-configs'
import { z } from 'zod'
import { mapArrayToUpdateStr } from '@shared/utils'

export function handlePanelConfigsSignalrEvent(signalrEvent: SignalrEventRequest) {
	switch (signalrEvent.action) {
		case SIGNALR_EVENT_ACTION.CREATE:
			return handleCreatePanelConfig(signalrEvent)
		case SIGNALR_EVENT_ACTION.CREATE_MANY:
			return handleCreateMany(signalrEvent)
		case SIGNALR_EVENT_ACTION.UPDATE:
			return handleUpdatePanelConfig(signalrEvent)
		case SIGNALR_EVENT_ACTION.UPDATE_MANY:
			return handleUpdateManyPanelConfigs(signalrEvent)
		case SIGNALR_EVENT_ACTION.DELETE:
			return handleDeletePanelConfig(signalrEvent)
		case SIGNALR_EVENT_ACTION.DELETE_MANY:
			return handleDeleteManyPanelConfigs(signalrEvent)
		default:
			throw new Error('Invalid signalr event type')
	}
}

function handleCreatePanelConfig(signalrEvent: SignalrEventRequest) {
	const panelConfig = parsePanelConfig(signalrEvent.data)
	return PanelConfigsActions.addPanelConfigNoSignalr({ panelConfig })
}

function handleCreateMany(signalrEvent: SignalrEventRequest) {
	const panelConfigs = parsePanelConfigArray(signalrEvent.data)
	return PanelConfigsActions.addManyPanelConfigsNoSignalr({ panelConfigs })
}

function handleUpdatePanelConfig(signalrEvent: SignalrEventRequest) {
	const panelConfig = parsePanelConfig(signalrEvent.data)
	return PanelConfigsActions.updatePanelConfigNoSignalr({
		update: {
			id: panelConfig.id,
			changes: panelConfig,
		},
	})
}

function handleUpdateManyPanelConfigs(signalrEvent: SignalrEventRequest) {
	const panelConfigs = parsePanelConfigArray(signalrEvent.data)
	const updates = mapArrayToUpdateStr(panelConfigs)
	return PanelConfigsActions.updateManyPanelConfigsNoSignalr({ updates })
}

function handleDeletePanelConfig(signalrEvent: SignalrEventRequest) {
	const panelConfigId = parsePanelConfigId(signalrEvent.data)
	return PanelConfigsActions.deletePanelConfigNoSignalr({ panelConfigId })
}

function handleDeleteManyPanelConfigs(signalrEvent: SignalrEventRequest) {
	const panelConfigIds = parsePanelConfigIdArray(signalrEvent.data)
	return PanelConfigsActions.deleteManyPanelConfigsNoSignalr({ panelConfigIds })
}

const parsePanelConfig = (data: string): PanelConfigModel => {
	const parsed = PANEL_CONFIG_MODEL.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	return parsed.data as PanelConfigModel
}

const parsePanelConfigArray = (data: string): PanelConfigModel[] => {
	const parsed = PANEL_CONFIG_MODEL.array().safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	return parsed.data as PanelConfigModel[]
}

const parsePanelConfigId = (data: string): PanelConfigId => {
	const parsed = z
		.object({
			id: z.string(),
		})
		.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	const idWrapper = parsed.data as {
		id: PanelConfigId
	}
	return idWrapper.id
}

const parsePanelConfigIdArray = (data: string): PanelConfigId[] => {
	const parsed = z
		.object({
			id: z.string(),
		})
		.array()
		.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	const idWrappers = parsed.data as {
		id: PanelConfigId
	}[]
	return idWrappers.map((w) => w.id)
}
