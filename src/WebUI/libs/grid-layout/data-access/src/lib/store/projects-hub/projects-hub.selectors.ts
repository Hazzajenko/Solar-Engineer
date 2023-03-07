import { createFeatureSelector } from '@ngrx/store'
import { PROJECTS_HUB_FEATURE_KEY, ProjectsHubState } from '@grid-layout/data-access'

export const selectProjectsHubsState =
  createFeatureSelector<ProjectsHubState>(PROJECTS_HUB_FEATURE_KEY)
