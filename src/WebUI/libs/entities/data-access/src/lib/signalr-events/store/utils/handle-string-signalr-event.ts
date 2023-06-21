import {
	SIGNALR_EVENT_ACTION,
	SignalrEventRequest,
	STRING_MODEL,
	StringId,
	StringModel,
} from '@entities/shared'
import { StringsActions } from '../../../strings'
import { z } from 'zod'
import { mapArrayToUpdateStr } from '@shared/utils'

export function handleStringSignalrEvent(signalrEvent: SignalrEventRequest) {
	switch (signalrEvent.action) {
		case SIGNALR_EVENT_ACTION.CREATE:
			return handleCreateString(signalrEvent)
		case SIGNALR_EVENT_ACTION.CREATE_MANY:
			return handleCreateMany(signalrEvent)
		case SIGNALR_EVENT_ACTION.UPDATE:
			return handleUpdateString(signalrEvent)
		case SIGNALR_EVENT_ACTION.UPDATE_MANY:
			return handleUpdateManyStrings(signalrEvent)
		case SIGNALR_EVENT_ACTION.DELETE:
			return handleDeleteString(signalrEvent)
		case SIGNALR_EVENT_ACTION.DELETE_MANY:
			return handleDeleteManyStrings(signalrEvent)
		default:
			throw new Error('Invalid signalr event type')
	}
}

function handleCreateString(signalrEvent: SignalrEventRequest) {
	const string = parseString(signalrEvent.data)
	return StringsActions.addStringNoSignalr({ string })
}

function handleCreateMany(signalrEvent: SignalrEventRequest) {
	const strings = parseStringArray(signalrEvent.data)
	return StringsActions.addManyStringsNoSignalr({ strings })
}

function handleUpdateString(signalrEvent: SignalrEventRequest) {
	const string = parseString(signalrEvent.data)
	return StringsActions.updateStringNoSignalr({
		update: {
			id: string.id,
			changes: string,
		},
	})
}

function handleUpdateManyStrings(signalrEvent: SignalrEventRequest) {
	const strings = parseStringArray(signalrEvent.data)
	const updates = mapArrayToUpdateStr(strings)
	return StringsActions.updateManyStringsNoSignalr({ updates })
}

function handleDeleteString(signalrEvent: SignalrEventRequest) {
	const stringId = parseStringId(signalrEvent.data)
	return StringsActions.deleteStringNoSignalr({ stringId })
}

function handleDeleteManyStrings(signalrEvent: SignalrEventRequest) {
	const stringIds = parseStringIdArray(signalrEvent.data)
	return StringsActions.deleteManyStringsNoSignalr({ stringIds })
}

const parseString = (data: string): StringModel => {
	const parsed = STRING_MODEL.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	return parsed.data as StringModel
}

const parseStringArray = (data: string): StringModel[] => {
	const parsed = STRING_MODEL.array().safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	return parsed.data as StringModel[]
}

const parseStringId = (data: string): StringId => {
	const parsed = z
		.object({
			id: z.string(),
		})
		.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	const idWrapper = parsed.data as {
		id: StringId
	}
	return idWrapper.id
}

const parseStringIdArray = (data: string): StringId[] => {
	const parsed = z
		.object({
			id: z.string(),
		})
		.array()
		.safeParse(JSON.parse(data))
	if (!parsed.success) throw new Error(parsed.error.message)
	const idWrappers = parsed.data as {
		id: StringId
	}[]
	return idWrappers.map((w) => w.id)
}
