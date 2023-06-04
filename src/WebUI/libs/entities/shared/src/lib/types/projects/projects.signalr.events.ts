export const PROJECTS_SIGNALR_METHOD = {
	CREATE_PROJECT: 'CreateProject',
	UPDATE_PROJECT: 'UpdateProject',
	DELETE_PROJECT: 'DeleteProject',
	DELETE_MANY_PROJECTS: 'DeleteManyProjects',
} as const

export type ProjectsSignalrMethod =
	(typeof PROJECTS_SIGNALR_METHOD)[keyof typeof PROJECTS_SIGNALR_METHOD]

export const PROJECTS_SIGNALR_EVENT = {
	GET_MANY_PROJECTS: 'GetManyProjects',
	PROJECT_CREATED: 'ProjectCreated',
	PROJECT_UPDATED: 'ProjectUpdated',
	PROJECT_DELETED: 'ProjectDeleted',
} as const

export type ProjectsSignalrEvent =
	(typeof PROJECTS_SIGNALR_EVENT)[keyof typeof PROJECTS_SIGNALR_EVENT]
