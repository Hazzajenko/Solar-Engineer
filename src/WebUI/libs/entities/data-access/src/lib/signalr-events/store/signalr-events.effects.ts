import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'

import { map } from 'rxjs'
import { SIGNALR_EVENT_MODEL } from '@entities/shared'
import { SignalrEventsActions } from './signalr-events.actions'
import {
	handlePanelConfigSignalrEvent,
	handlePanelLinkSignalrEvent,
	handlePanelSignalrEvent,
	handleStringSignalrEvent,
} from './utils'

export const addSignalrEvent$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(SignalrEventsActions.addSignalrEvent),
			map(({ signalrEvent }) => {
				switch (signalrEvent.model) {
					case SIGNALR_EVENT_MODEL.PANEL:
						return handlePanelSignalrEvent(signalrEvent)
					case SIGNALR_EVENT_MODEL.STRING:
						return handleStringSignalrEvent(signalrEvent)
					case SIGNALR_EVENT_MODEL.PANEL_LINK:
						return handlePanelLinkSignalrEvent(signalrEvent)
					case SIGNALR_EVENT_MODEL.PANEL_CONFIG:
						return handlePanelConfigSignalrEvent(signalrEvent)
					default:
						throw new Error('Invalid signalr event model')
				}
			}),
		)
	},
	{ functional: true },
)
