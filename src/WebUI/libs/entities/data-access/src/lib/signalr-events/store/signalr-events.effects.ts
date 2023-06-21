import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'

import { map } from 'rxjs'
import { SIGNALR_EVENT_MODEL } from '@entities/shared'
import { SignalrEventsActions } from './signalr-events.actions'
import {
	handlePanelConfigsSignalrEvent,
	handlePanelLinksSignalrEvent,
	handlePanelsSignalrEvent,
	handleStringsSignalrEvent,
} from './utils'

export const addSignalrEvent$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(SignalrEventsActions.addSignalrEvent),
			map(({ signalrEvent }) => {
				switch (signalrEvent.model) {
					case SIGNALR_EVENT_MODEL.PANEL:
						return handlePanelsSignalrEvent(signalrEvent)
					case SIGNALR_EVENT_MODEL.STRING:
						return handleStringsSignalrEvent(signalrEvent)
					case SIGNALR_EVENT_MODEL.PANEL_LINK:
						return handlePanelLinksSignalrEvent(signalrEvent)
					case SIGNALR_EVENT_MODEL.PANEL_CONFIG:
						return handlePanelConfigsSignalrEvent(signalrEvent)
					default:
						throw new Error('Invalid signalr event model')
				}
			}),
		)
	},
	{ functional: true },
)
