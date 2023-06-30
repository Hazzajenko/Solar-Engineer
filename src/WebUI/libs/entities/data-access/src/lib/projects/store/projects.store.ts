import { Store } from '@ngrx/store'
import {
	selectAllProjects,
	selectProjectById,
	selectProjectReadyForReset,
	selectProjectReadyToRender,
	selectProjectsEntities,
	selectSelectedProject,
	selectSelectedProjectId,
} from './projects.selectors'
import { ProjectsActions } from './projects.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	AcceptInviteToProjectResponse,
	AcceptProjectInviteRequest,
	CreateProjectRequest,
	InviteToProjectRequest,
	KickProjectMemberRequest,
	ProjectId,
	ProjectMemberKickedResponse,
	ProjectMemberUpdatedResponse,
	ProjectModel,
	ProjectTemplate,
	RejectProjectInviteRequest,
	UpdateProjectMemberRequest,
	UserLeftProjectResponse,
} from '@entities/shared'
import { createRootServiceInjector } from '@shared/utils'
import { EntityUpdate } from '@shared/data-access/models'

export function injectProjectsStore(): ProjectsStoreFactory {
	return projectsStoreInjector()
}

const projectsStoreInjector = createRootServiceInjector(projectsStoreFactory, {
	deps: [Store],
})

export type ProjectsStoreFactory = ReturnType<typeof projectsStoreFactory>

export function projectsStoreFactory(store: Store) {
	const entities = store.selectSignal(selectProjectsEntities)

	const select = {
		allProjects: store.selectSignal(selectAllProjects),
		selectedProjectId: store.selectSignal(selectSelectedProjectId),
		selectedProject: store.selectSignal(selectSelectedProject),
		getById: (id: ProjectId) => entities()[id],
		selectById: (id: ProjectId) => store.selectSignal(selectProjectById({ id })),
		projectReadyToRender: store.selectSignal(selectProjectReadyToRender),
		projectReadyForReset: store.selectSignal(selectProjectReadyForReset), // allWebProjects: store.selectSignal(selectAllWebProjects),
	}

	const dispatch = {
		loadProjectTemplate: (templateName: ProjectTemplate['templateName']) =>
			store.dispatch(ProjectsActions.loadProjectTemplate({ templateName })),
		createProjectSignalr: (request: CreateProjectRequest) =>
			store.dispatch(ProjectsActions.createProjectSignalr({ request })),
		loadUserProjects: () => store.dispatch(ProjectsActions.loadUserProjects()),
		loadUserProjectsSuccess: (projects: ProjectModel[]) =>
			store.dispatch(ProjectsActions.loadUserProjectsSuccess({ projects })),
		selectProject: (projectId: ProjectId) =>
			store.dispatch(ProjectsActions.selectProject({ projectId })),
		inviteUsersToProject: (request: InviteToProjectRequest) =>
			store.dispatch(ProjectsActions.inviteUsersToProject({ request })),
		acceptProjectInvite: (request: AcceptProjectInviteRequest) =>
			store.dispatch(ProjectsActions.acceptProjectInvite({ request })),
		rejectProjectInvite: (request: RejectProjectInviteRequest) =>
			store.dispatch(ProjectsActions.rejectProjectInvite({ request })),
		userAcceptedInviteToProject: (response: AcceptInviteToProjectResponse) =>
			store.dispatch(ProjectsActions.userAcceptedInviteToProject({ response })),
		userLeftProject: (response: UserLeftProjectResponse) =>
			store.dispatch(ProjectsActions.userLeftProject({ response })),
		updateProjectMember: (request: UpdateProjectMemberRequest) =>
			store.dispatch(ProjectsActions.updateProjectMember({ request })),
		updateProjectMemberNoSignalr: (response: ProjectMemberUpdatedResponse) =>
			store.dispatch(ProjectsActions.updateProjectMemberNoSignalr({ response })),
		kickProjectMember: (request: KickProjectMemberRequest) =>
			store.dispatch(ProjectsActions.kickProjectMember({ request })),
		projectMemberKicked: (response: ProjectMemberKickedResponse) =>
			store.dispatch(ProjectsActions.projectMemberKicked({ response })),
		addProject: (project: ProjectModel) => store.dispatch(ProjectsActions.addProject({ project })),
		addManyProjects: (projects: ProjectModel[]) =>
			store.dispatch(ProjectsActions.addManyProjects({ projects })),
		updateProject: (update: EntityUpdate<ProjectModel>) =>
			store.dispatch(ProjectsActions.updateProject({ update })),
		updateProjectNoSignalr: (update: EntityUpdate<ProjectModel>) =>
			store.dispatch(ProjectsActions.updateProjectNoSignalr({ update })),
		updateManyProjects: (updates: UpdateStr<ProjectModel>[]) =>
			store.dispatch(ProjectsActions.updateManyProjects({ updates })),
		deleteProject: (projectId: ProjectId) =>
			store.dispatch(ProjectsActions.deleteProject({ projectId })),
		deleteProjectNoSignalr: (projectId: ProjectId) =>
			store.dispatch(ProjectsActions.deleteProjectNoSignalr({ projectId })),
		deleteManyProjects: (projectIds: ProjectId[]) =>
			store.dispatch(ProjectsActions.deleteManyProjects({ projectIds })),
		leaveProject: (projectId: ProjectId) =>
			store.dispatch(ProjectsActions.leaveProject({ projectId })),
		clearProjectsState: () => store.dispatch(ProjectsActions.clearProjectsState()),
	}

	return {
		select,
		dispatch,
	}
}
