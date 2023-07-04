import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import {
	AuthActions,
	injectConnectionsStore,
	injectUsersStore,
	UsersSignalrService,
} from '@auth/data-access'
import { tap } from 'rxjs'
import {
	injectEntityStore,
	injectProjectsStore,
	injectSignalrEventsStore,
	ProjectsSignalrService,
} from '@entities/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { injectAppStateStore } from '@canvas/app/data-access'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { injectObjectPositioningStore } from '@canvas/object-positioning/data-access'
import { injectNotificationsStore } from '@overlays/notifications/data-access'
import { ApplicationInsightsService } from '@app/logging'

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
		usersSignalrService = inject(UsersSignalrService),
		projectsSignalrService = inject(ProjectsSignalrService),
		insightsService = inject(ApplicationInsightsService),
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
				usersSignalrService.hubConnection?.stop()
				projectsSignalrService.hubConnection?.stop()
				insightsService.logEvent('signOut')
				insightsService.clearAuthenticatedUserContext()
				uiStore.dispatch.openDialog({
					component: DIALOG_COMPONENT.INITIAL_VISIT_WITH_TEMPLATES,
				})
			}),
		)
	},
	{ functional: true, dispatch: false },
)
