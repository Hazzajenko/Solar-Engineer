import { ProjectId } from './project.model'
import { CustomIdType } from '@shared/utils'

export const PROJECTS_SIGNALR_METHOD = {
	SELECT_PROJECT: 'SelectProject',
	CREATE_PROJECT: 'CreateProject',
	UPDATE_PROJECT: 'UpdateProject',
	DELETE_PROJECT: 'DeleteProject',
	DELETE_MANY_PROJECTS: 'DeleteManyProjects',
	SEND_PROJECT_EVENT: 'SendProjectEvent',
	GET_PROJECT_BY_ID: 'GetProjectById',
	INVITE_USERS_TO_PROJECT: 'InviteUsersToProject',
	ACCEPT_PROJECT_INVITE: 'AcceptProjectInvite',
	REJECT_PROJECT_INVITE: 'RejectProjectInvite',
	LEAVE_PROJECT: 'LeaveProject',
	UPDATE_PROJECT_MEMBER: 'UpdateProjectMember',
	KICK_PROJECT_MEMBER: 'KickProjectMember',
	SEND_MOUSE_POSITION: 'SendMousePosition',
} as const
export type ProjectsSignalrMethod =
	(typeof PROJECTS_SIGNALR_METHOD)[keyof typeof PROJECTS_SIGNALR_METHOD]

export const PROJECTS_SIGNALR_EVENT = {
	GET_MANY_PROJECTS: 'GetManyProjects',
	GET_PROJECT: 'GetProject',
	PROJECT_CREATED: 'ProjectCreated',
	PROJECT_UPDATED: 'ProjectUpdated',
	PROJECT_DELETED: 'ProjectDeleted',
	RECEIVE_PROJECT_EVENT: 'ReceiveProjectEvent',
	RECEIVE_COMBINED_PROJECT_EVENT: 'ReceiveCombinedProjectEvent',
	INVITED_TO_PROJECT: 'InvitedToProject',
	USERS_SENT_INVITE_TO_PROJECT: 'UsersSentInviteToProject',
	USER_ACCEPTED_INVITE_TO_PROJECT: 'UserAcceptedInviteToProject',
	USER_REJECTED_INVITE_TO_PROJECT: 'UserRejectedInviteToProject',
	USER_LEFT_PROJECT: 'UserLeftProject',
	LEFT_PROJECT: 'LeftProject',
	PROJECT_MEMBER_UPDATED: 'ProjectMemberUpdated',
	PROJECT_MEMBER_KICKED: 'ProjectMemberKicked',
	KICKED_FROM_PROJECT: 'KickedFromProject',
	RECEIVE_USER_MOUSE_POSITION: 'ReceiveUserMousePosition',
} as const

export type ProjectSignalrEvent =
	(typeof PROJECTS_SIGNALR_EVENT)[keyof typeof PROJECTS_SIGNALR_EVENT]

export type RequestId = CustomIdType<'requestId'>

export type SignalrEventRequest = {
	requestId: RequestId
	projectId: ProjectId
	action: SignalrEventAction
	model: ProjectEntityModel
	data: string
	timeStamp: string
}

export type SignalrEventResponse = SignalrEventRequest & {
	byAppUserId: string
	isSuccess: boolean
	error?: string
	timeStamp: string
	serverTime: string
	timeDiff: number
	appending: boolean
}

export type CombinedProjectEvent = {
	requestId: RequestId
	projectId: ProjectId
	actionOne: SignalrEventAction
	modelOne: ProjectEntityModel
	dataOne: string
	actionTwo: SignalrEventAction
	modelTwo: ProjectEntityModel
	dataTwo: string
	timeStamp: string
}

export type CombinedProjectEventResponse = CombinedProjectEvent & {
	byAppUserId: string
	isSuccess: boolean
	error?: string
	timeStamp: string
	serverTime: string
	timeDiff: number
}

export const SIGNALR_EVENT_ACTION = {
	CREATE: 'Create',
	UPDATE: 'Update',
	DELETE: 'Delete',
	CREATE_MANY: 'CreateMany',
	UPDATE_MANY: 'UpdateMany',
	DELETE_MANY: 'DeleteMany',
} as const

export type SignalrEventAction = (typeof SIGNALR_EVENT_ACTION)[keyof typeof SIGNALR_EVENT_ACTION]

export const PROJECT_ENTITY_MODEL = {
	UNDEFINED: 'Undefined',
	INVERTER: 'Inverter',
	PANEL: 'Panel',
	CABLE: 'Cable',
	DISCONNECTIONPOINT: 'DisconnectionPoint',
	TRAY: 'Tray',
	RAIL: 'Rail',
	TRACKER: 'Tracker',
	STRING: 'String',
	PANEL_LINK: 'PanelLink',
	PANEL_CONFIG: 'PanelConfig',
} as const

export type ProjectEntityModel = (typeof PROJECT_ENTITY_MODEL)[keyof typeof PROJECT_ENTITY_MODEL]
