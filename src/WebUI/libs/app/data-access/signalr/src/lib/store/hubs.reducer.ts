import { HubsActions } from './hubs.actions'
import { Action, createReducer, on } from '@ngrx/store'
import { HubConnection } from '@microsoft/signalr'

export interface HubsState {
	projectsHub: HubConnection | undefined
	usersHub: HubConnection | undefined
	error: string | null
}

export const HUBS_FEATURE_KEY = 'hubs'
export const initialHubsState: HubsState = {
	projectsHub: undefined,
	usersHub: undefined,
	error: null,
}

export const reducer = createReducer(
	initialHubsState,

	on(HubsActions.usersHubConnected, (state, { usersHubConnection }) => ({
		...state,
		usersHub: usersHubConnection,
	})),

	on(HubsActions.projectsHubConnected, (state, { projectsHubConnection }) => ({
		...state,
		projectsHub: projectsHubConnection,
	})),
)

export function hubsReducer(state: HubsState | undefined, action: Action) {
	return reducer(state, action)
}
