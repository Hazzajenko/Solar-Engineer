import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { AuthActions, injectConnectionsStore, injectUsersStore } from '@auth/data-access'
import { tap } from 'rxjs'
import {
	injectEntityStore,
	injectProjectsStore,
	injectSignalrEventsStore,
} from '@entities/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { injectAppStateStore } from '@canvas/app/data-access'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { injectObjectPositioningStore } from '@canvas/object-positioning/data-access'
import { injectNotificationsStore } from '@overlays/notifications/data-access'

export const onSignOut$ = createEffect(
	(
		actions$ = inject(Actions),
		usersStore = injectUsersStore(),
		connectionsStore = injectConnectionsStore(),
		projectsStore = injectProjectsStore(),
		signalrEventsStore = injectSignalrEventsStore(),
		selectedStore = injectSelectedStore(),
		entityStore = injectEntityStore(),
		appStateStore = injectAppStateStore(),
		uiStore = injectUiStore(),
		objectPositioningStore = injectObjectPositioningStore(),
		notificationsStore = injectNotificationsStore(),
	) => {
		return actions$.pipe(
			ofType(AuthActions.signOut),
			tap(() => {
				localStorage.removeItem('token')
				usersStore.dispatch.clearUsersState()
				connectionsStore.dispatch.clearConnectionsState()
				projectsStore.dispatch.clearProjectsState()
				signalrEventsStore.dispatch.clearSignalrEventsState()
				selectedStore.dispatch.clearSelectedState()
				entityStore.panels.dispatch.clearPanelsState()
				entityStore.panelLinks.dispatch.clearPanelLinksState()
				entityStore.strings.dispatch.clearStringsState()
				entityStore.panelConfigs.dispatch.clearPanelConfigsState()
				appStateStore.dispatch.clearState()
				uiStore.dispatch.clearUiState()
				objectPositioningStore.dispatch.clearObjectPositioningState()
				notificationsStore.dispatch.clearNotificationsState()
			}),
		)
	},
	{ functional: true, dispatch: false },
)
