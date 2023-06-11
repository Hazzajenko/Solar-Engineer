import { HUBS_FEATURE_KEY, HubsState } from './hubs.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectHubsState = createFeatureSelector<HubsState>(HUBS_FEATURE_KEY)
export const selectUsersHub = createSelector(selectHubsState, (hubs) => hubs.usersHub)
export const selectProjectsHub = createSelector(selectHubsState, (hubs) => hubs.projectsHub)
