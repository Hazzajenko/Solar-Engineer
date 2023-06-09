import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { PanelsActions, SignalrEventsActions } from '@entities/data-access'
import { map } from 'rxjs'
import {
	PANEL_MODEL,
	PanelId,
	PanelModel,
	SIGNALR_EVENT_ACTION,
	SIGNALR_EVENT_MODEL,
	SignalrEventRequest,
} from '@entities/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { z } from 'zod'

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
			const parsed = PANEL_MODEL.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const panel = parsed.data as PanelModel
			return PanelsActions.addPanelNoSignalr({ panel })
		}
		case SIGNALR_EVENT_ACTION.CREATE_MANY: {
			const parsed = PANEL_MODEL.array().safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const panels = parsed.data as PanelModel[]
			return PanelsActions.addManyPanelsNoSignalr({
				panels,
			})
		}
		case SIGNALR_EVENT_ACTION.UPDATE: {
			const parsed = PANEL_MODEL.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as PanelModel
			return PanelsActions.updatePanelNoSignalr({
				update: {
					id: data.id,
					changes: data,
				},
			})
		}
		case SIGNALR_EVENT_ACTION.UPDATE_MANY: {
			const parsed = PANEL_MODEL.array().safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const updates = parsed.data.map(
				(panel) =>
					({
						id: panel.id,
						changes: panel,
					} as UpdateStr<PanelModel>),
			)
			return PanelsActions.updateManyPanelsNoSignalr({
				updates,
			})
		}
		case SIGNALR_EVENT_ACTION.DELETE: {
			const parsed = z
				.object({
					id: z.string(),
				})
				.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as {
				id: PanelId
			}
			return PanelsActions.deletePanelNoSignalr({
				panelId: data.id,
			})
		}
		case SIGNALR_EVENT_ACTION.DELETE_MANY: {
			const parsed = z
				.object({
					id: z.string(),
				})
				.array()
				.safeParse(JSON.parse(signalrEvent.data))
			if (!parsed.success) throw new Error(parsed.error.message)
			const data = parsed.data as {
				id: PanelId
			}[]
			return PanelsActions.deleteManyPanelsNoSignalr({
				panelIds: data.map((d) => d.id),
			})
		}
		default:
			throw new Error('Invalid signalr event type')
	}
}
