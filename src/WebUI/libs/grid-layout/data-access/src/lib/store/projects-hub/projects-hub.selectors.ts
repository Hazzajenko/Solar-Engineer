import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  PROJECTS_HUB_FEATURE_KEY,
  projectsHubAdapter,
  ProjectsHubState,
} from './projects-hub.reducer'
import { ProjectSignalrEvent } from '@shared/data-access/models'

export const selectProjectsHubsState =
  createFeatureSelector<ProjectsHubState>(PROJECTS_HUB_FEATURE_KEY)

const { selectAll } = projectsHubAdapter.getSelectors()

export const selectAllProjectEvents = createSelector(
  selectProjectsHubsState,
  (state: ProjectsHubState) => selectAll(state),
)

export const selectProjectEventByRequestId = (props: { requestId: string }) =>
  createSelector(selectAllProjectEvents, (projectEvents: ProjectSignalrEvent[]) =>
    projectEvents.find((projectEvent) => projectEvent.requestId === props.requestId),
  )
