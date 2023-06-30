import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'

import { map } from 'rxjs'
import { PROJECT_ENTITY_MODEL } from '@entities/shared'
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
					case PROJECT_ENTITY_MODEL.PANEL:
						return handlePanelsSignalrEvent(signalrEvent)
					case PROJECT_ENTITY_MODEL.STRING:
						return handleStringsSignalrEvent(signalrEvent)
					case PROJECT_ENTITY_MODEL.PANEL_LINK:
						return handlePanelLinksSignalrEvent(signalrEvent)
					case PROJECT_ENTITY_MODEL.PANEL_CONFIG:
						return handlePanelConfigsSignalrEvent(signalrEvent)
					default:
						throw new Error('Invalid signalr event model')
				}
			}),
		)
	},
	{ functional: true },
)
