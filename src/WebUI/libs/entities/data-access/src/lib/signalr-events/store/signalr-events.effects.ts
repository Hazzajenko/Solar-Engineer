import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions, SignalrEventsActions } from '@entities/data-access'
import { map } from 'rxjs'
import {
	CREATE_MANY_PANELS_SIGNALR_REQUEST,
	CREATE_PANEL_SIGNALR_REQUEST,
	CreateManyPanelsSignalrRequest,
	CreatePanelSignalrRequest,
	DELETE_MANY_PANELS_SIGNALR_REQUEST,
	DELETE_PANEL_SIGNALR_REQUEST,
	DeleteManyPanelsSignalrRequest,
	DeletePanelSignalrRequest,
	PanelModel,
	SIGNALR_EVENT_ACTION,
	SIGNALR_EVENT_MODEL,
	SignalrEventRequest,
	UPDATE_MANY_PANELS_SIGNALR_REQUEST,
	UPDATE_PANEL_SIGNALR_REQUEST,
	UpdateManyPanelsSignalrRequest,
	UpdatePanelSignalrRequest,
} from '@entities/shared'
import { AngleRadians } from '@shared/data-access/models'

export const addSignalrEvent$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(SignalrEventsActions.addSignalrEvent),
			map(({ signalrEvent }) => {
				switch (signalrEvent.model) {
					case SIGNALR_EVENT_MODEL.PANEL:
						return handlePanelSignalrEvent(signalrEvent)
					case SIGNALR_EVENT_MODEL.STRING:
						return SignalrEventsActions.noop()
					case SIGNALR_EVENT_MODEL.PANEL_LINK:
						return SignalrEventsActions.noop()
					case SIGNALR_EVENT_MODEL.PANEL_CONFIG:
						return SignalrEventsActions.noop()
					default:
						throw new Error('Invalid signalr event model')
				}
			}),
		)
	},
	{ functional: true },
)

function handlePanelSignalrEvent(signalrEvent: SignalrEventRequest) {
	switch (signalrEvent.action) {
		case SIGNALR_EVENT_ACTION.CREATE: {
			const parsed = CREATE_PANEL_SIGNALR_REQUEST.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as CreatePanelSignalrRequest
			return PanelsActions.addPanelNoSignalr({ panel: data.panel })
		}
		case SIGNALR_EVENT_ACTION.CREATE_MANY: {
			const parsed = CREATE_MANY_PANELS_SIGNALR_REQUEST.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as CreateManyPanelsSignalrRequest
			const panels = data.panels.map(
				(panel) =>
					({
						...panel,
						panelConfigId: data.panelConfigId,
						angle: data.angle as AngleRadians,
						stringId: data.stringId,
					} as PanelModel),
			)
			return PanelsActions.addManyPanelsNoSignalr({
				panels,
			})
		}
		case SIGNALR_EVENT_ACTION.UPDATE: {
			const parsed = UPDATE_PANEL_SIGNALR_REQUEST.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as UpdatePanelSignalrRequest
			return PanelsActions.updatePanelNoSignalr({
				update: data.update,
			})
		}
		case SIGNALR_EVENT_ACTION.UPDATE_MANY: {
			const parsed = UPDATE_MANY_PANELS_SIGNALR_REQUEST.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as UpdateManyPanelsSignalrRequest
			return PanelsActions.updateManyPanelsNoSignalr({
				updates: data.updates,
			})
		}
		case SIGNALR_EVENT_ACTION.DELETE: {
			const parsed = DELETE_PANEL_SIGNALR_REQUEST.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as DeletePanelSignalrRequest
			return PanelsActions.deletePanelNoSignalr({
				panelId: data.panelId,
			})
		}
		case SIGNALR_EVENT_ACTION.DELETE_MANY: {
			const parsed = DELETE_MANY_PANELS_SIGNALR_REQUEST.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as DeleteManyPanelsSignalrRequest
			return PanelsActions.deleteManyPanelsNoSignalr({
				panelIds: data.panelIds,
			})
		}
		default:
			throw new Error('Invalid signalr event type')
	}
}
