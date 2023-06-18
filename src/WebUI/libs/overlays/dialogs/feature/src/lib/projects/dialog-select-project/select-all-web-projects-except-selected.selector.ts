import { createSelector } from '@ngrx/store'
import { selectSelectedProjectId } from '@entities/data-access'
import { selectAllWebProjects } from '@overlays/side-uis/feature'

export const selectAllWebProjectsExceptSelected = createSelector(
	selectAllWebProjects,
	selectSelectedProjectId,
	(projects, selectedProjectId) => projects.filter((project) => project.id !== selectedProjectId),
)
