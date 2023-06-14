import { PROJECTS_FEATURE_KEY, projectsAdapter, ProjectsState } from './projects.reducer'
import { ProjectModel, ProjectWebModel } from '@entities/shared'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectUserById } from '@auth/data-access'
import { WebUserModel } from '@auth/shared'

export const selectProjectsState = createFeatureSelector<ProjectsState>(PROJECTS_FEATURE_KEY)

const { selectAll, selectEntities } = projectsAdapter.getSelectors()

export const selectAllProjects = createSelector(selectProjectsState, (state: ProjectsState) =>
	selectAll(state),
)

export const selectProjectsEntities = createSelector(selectProjectsState, (state: ProjectsState) =>
	selectEntities(state),
)

export const selectProjectById = (props: { id: string }) =>
	createSelector(selectProjectsEntities, (projects: Dictionary<ProjectModel>) => projects[props.id])

export const selectProjectByIdV2 = (props: { id: string }) =>
	createSelector(selectAllProjects, (projects: ProjectModel[]) =>
		projects.find((p) => p.id === props.id),
	)

export const selectSelectedProjectId = createSelector(
	selectProjectsState,
	(state: ProjectsState) => state.selectedProjectId,
)

export const selectSelectedProject = createSelector(
	selectProjectsEntities,
	selectSelectedProjectId,
	(projects: Dictionary<ProjectModel>, selectedProjectId: string | undefined) =>
		selectedProjectId ? projects[selectedProjectId] : undefined,
)

export const selectProjectReadyToRender = createSelector(
	selectProjectsState,
	(state: ProjectsState) =>
		state.storesToInit.panels &&
		state.storesToInit.strings && // state.storesToInit.panelLinks &&
		state.storesToInit.panelConfigs,
)

export const selectProjectReadyForReset = createSelector(
	selectProjectsState,
	(state: ProjectsState) =>
		state.storesToClear.panels &&
		state.storesToClear.strings &&
		state.storesToClear.panelLinks &&
		state.storesToClear.panelConfigs,
)

export const selectProjectByIdWithProjectWebUsers = (props: { id: string }) =>
	createSelector(
		selectProjectById({ id: props.id }),
		selectUserById({ id: props.id }),
		(project: ProjectModel | undefined, user: WebUserModel | undefined) => {
			if (!project || !user) return undefined
			const members = project.members.map((m) => ({ ...m, ...user }))
			return { ...project, members } as ProjectWebModel
		},
	)

// s1: Selector<T, R>,     projector: (s1: R) => R):    MemoizedSelector<T, R, (s1: R) => R>
/*
 export const createSafeSelector = <T, R>(selector: Selector<T, R>, projector: (s1: R) => R) => {
 if (selector === undefined) throw new Error('Selector is undefined')
 return createSelector(selector, projector)
 }

 export const createSafeSelectorV2 = <State, S1, S2, Result>(
 selector1: Selector<State, S1>,
 selector2: Selector<State, S2>,
 projector: (s1: S1, s2: S2) => Result,
 ) => {
 if (selector1 === undefined) throw new Error('selector1 is undefined')
 if (selector2 === undefined) throw new Error('selector2 is undefined')
 return createSelector(selector1, selector2, projector)
 }

 /!*export const selectAllWebProjects = createSafeSelector(
 selectAllProjects,
 (projects: ProjectModel[]) => projects,
 )*!/

 export const selectAllWebProjectsC2 = createSafeSelectorV2(
 selectAllProjects,
 selectUsersEntities,
 (projects: ProjectModel[], users: Dictionary<WebUserModel>) =>
 projects.map((project) => {
 const projectWebUsers = project.members.map((member) => {
 const webUser = users[member.id]
 if (!webUser) {
 console.error(`Web user with id ${member.id} not found`)
 throw new Error(`Web user with id ${member.id} not found`)
 }
 return { ...member, ...webUser } as ProjectWebUserModel
 })
 return { ...project, members: projectWebUsers } as ProjectWebModel
 }),
 )*/
