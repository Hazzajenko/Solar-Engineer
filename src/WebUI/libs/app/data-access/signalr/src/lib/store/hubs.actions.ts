import { createActionGroup, props } from '@ngrx/store'
import { HubConnection } from '@microsoft/signalr'

export const HubsActions = createActionGroup({
	source: 'Hubs Store',
	events: {
		'Users Hub Connected': props<{
			usersHubConnection: HubConnection
		}>(),
		'Projects Hub Connected': props<{
			projectsHubConnection: HubConnection
		}>(),
	},
})
